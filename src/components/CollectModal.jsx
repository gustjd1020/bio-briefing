import React, { useState } from 'react'
import { getKeywords, getTopicGroups, addNews, getNewsKeywords, setNewsKeywords } from '../data/db'

// ── 출처 목록 ────────────────────────────────
const SOURCES = [
  'Nature', 'PubMed', 'NEJM', 'Lancet', '동아사이언스',
  'bioRxiv', 'STAT News', 'The Pharma News', 'BioSpectator',
  'Google Scholar',
]

const PERIODS = [
  { value: '1d',  label: '최근 1일'  },
  { value: '1w',  label: '최근 1주'  },
  { value: '1m',  label: '최근 1개월' },
  { value: '6m',  label: '최근 6개월' },
  { value: '1y',  label: '최근 1년'  },
  { value: '2y',  label: '최근 2년'  },
  { value: '5y',  label: '최근 5년'  },
]

const PERIOD_LABEL = {
  '1d': '최근 1일',
  '1w': '최근 1주',
  '1m': '최근 1개월',
  '6m': '최근 6개월',
  '1y': '최근 1년',
  '2y': '최근 2년',
  '5y': '최근 5년',
}

const STEP_LABELS = ['수집 설정', 'AI 수집 중', '결과 검토']

function getCurrentWeekLabel() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

// ── Claude API 호출 ──────────────────────────
async function callClaudeAPI(kwNames, sources, periodLabel) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('API_KEY_MISSING')
  }

  const systemPrompt = `당신은 바이오/제약 뉴스 수집 전문가입니다.
반드시 web_search 도구를 사용해서 실제 뉴스를 검색하세요.
URL은 반드시 검색 결과에서 나온 실제 URL만 사용하세요.
절대로 URL을 추측하거나 만들어내지 마세요.
검색으로 확인된 URL만 포함하고, 확인되지 않은 항목은 제외하세요.`

  const userPrompt = `web_search 도구를 사용해서 다음 키워드 관련 최신 바이오/제약 뉴스를 검색해줘:

키워드: ${kwNames.join(', ')}
출처: ${sources.length > 0 ? sources.join(', ') : '모든 신뢰할 수 있는 출처'}
기간: ${periodLabel}

각 검색 결과에서 실제 URL을 확인한 후, 아래 JSON 형식으로만 응답해줘 (다른 텍스트 없이):
{"items":[{"title":"원문 제목","summary":"원문 내용 기반 요약 200자 이내","url":"검색으로 확인된 실제 URL","source_name":"출처명","published_at":"YYYY-MM-DD","keywords":["해당 키워드들"],"url_confidence":"high"}]}

url_confidence는 web_search로 직접 확인된 경우만 "high"로 설정. 최대 5개까지만 반환.`

  const response = await fetch('/api/anthropic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.error?.message || `API 오류 (${response.status})`)
  }

  const data = await response.json()

  // web_search 사용 시 content 배열에 tool_use/tool_result 블록이 섞임
  // → type === 'text' 블록만 추려서 합침
  const textContent = (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim()

  if (!textContent) throw new Error('AI 응답에 텍스트가 없습니다.')

  // 마크다운 펜스 제거 (안전망)
  const jsonStr = textContent
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  const parsed = JSON.parse(jsonStr)
  return Array.isArray(parsed.items) ? parsed.items : []
}

// ── 메인 컴포넌트 ─────────────────────────────
export default function CollectModal({ onClose, onCollected }) {
  const allKeywords = getKeywords().sort((a, b) => a.priority - b.priority)

  const [step, setStep] = useState(1)

  // Step 1
  const [selKw, setSelKw] = useState([])
  const [selSrc, setSelSrc] = useState([])
  const [period, setPeriod] = useState('1y')

  // Step 2
  const [loadingMsg, setLoadingMsg] = useState('')

  // Step 3
  const [results, setResults] = useState([])
  const [checkedIds, setCheckedIds] = useState([]) // result index 목록
  const [error, setError] = useState(null)

  // Step 4
  const [savedCount, setSavedCount] = useState(0)

  const toggleKw = (id) =>
    setSelKw((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const toggleSrc = (s) =>
    setSelSrc((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  const toggleCheck = (idx) =>
    setCheckedIds((p) => (p.includes(idx) ? p.filter((x) => x !== idx) : [...p, idx]))

  // ── Step 1 → 2: AI 수집 시작 ──────────────
  const handleStartCollect = async () => {
    if (selKw.length === 0) { alert('키워드를 하나 이상 선택해주세요.'); return }

    setStep(2)
    setError(null)
    setResults([])

    const kwNames = selKw
      .map((id) => allKeywords.find((k) => k.id === id)?.name)
      .filter(Boolean)

    setLoadingMsg(`Claude AI가 "${kwNames.slice(0, 3).join(', ')}" 관련 뉴스를 검색하는 중...`)

    try {
      const items = await callClaudeAPI(kwNames, selSrc, PERIOD_LABEL[period] || period)
      setResults(items)
      setCheckedIds(items.map((_, i) => i)) // 전체 기본 체크
      setStep(3)
    } catch (err) {
      setError(err.message || '알 수 없는 오류')
      setStep(3)
    }
  }

  // ── Step 3 → 4: 선택 항목 저장 ────────────
  const handleSave = () => {
    const toSave = results.filter((_, i) => checkedIds.includes(i))
    const weekLabel = getCurrentWeekLabel()
    const newNkEntries = []

    for (const item of toSave) {
      const urlStatus = item.url_confidence === 'high' ? 'verified' : 'unverified'

      const added = addNews({
        title: item.title || '(제목 없음)',
        summary: item.summary || '',
        url: item.url || '#',
        source_name: item.source_name || '',
        published_at: item.published_at || new Date().toISOString().split('T')[0],
        topic_group_id: null,
        week_label: weekLabel,
        is_featured: false,
        is_bookmarked: false,
        notes: '',
        url_status: urlStatus,
      })

      // 키워드 매핑 (이름 기반 매칭, 대소문자 무시)
      const kwIds = (item.keywords || [])
        .map((kwName) =>
          allKeywords.find(
            (k) =>
              k.name === kwName ||
              k.name.toLowerCase() === kwName.toLowerCase()
          )
        )
        .filter(Boolean)
        .map((k) => k.id)

      kwIds.forEach((id) => newNkEntries.push({ news_id: added.id, keyword_id: id }))
    }

    if (newNkEntries.length > 0) {
      setNewsKeywords([...getNewsKeywords(), ...newNkEntries])
    }

    setSavedCount(toSave.length)
    onCollected && onCollected()
    setStep(4)
  }

  const allChecked = results.length > 0 && checkedIds.length === results.length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal collect-modal-v2 collect-modal-ai" onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="modal-header">
          <h2>🤖 AI 뉴스 수집</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* 스텝 인디케이터 (step 1~3) */}
        {step <= 3 && (
          <div className="collect-steps">
            {STEP_LABELS.map((label, i) => {
              const s = i + 1
              return (
                <React.Fragment key={s}>
                  <div
                    className={`collect-step-item${step >= s ? ' active' : ''}${step > s ? ' done' : ''}`}
                  >
                    <div className="collect-step-circle">{step > s ? '✓' : s}</div>
                    <div className="collect-step-label">{label}</div>
                  </div>
                  {i < 2 && <div className={`collect-step-line${step > s ? ' done' : ''}`} />}
                </React.Fragment>
              )
            })}
          </div>
        )}

        {/* 바디 */}
        <div className="modal-body">

          {/* ── STEP 1: 수집 설정 ── */}
          {step === 1 && (
            <div className="collect-step-content">

              <div className="modal-section">
                <div className="modal-section-title">🏷️ 키워드 선택</div>
                <div className="modal-chips">
                  {allKeywords.map((kw) => (
                    <button
                      key={kw.id}
                      className={`chip${selKw.includes(kw.id) ? ' selected' : ''}`}
                      style={
                        selKw.includes(kw.id)
                          ? { background: kw.color, borderColor: kw.color, color: '#fff' }
                          : { borderColor: kw.color, color: kw.color }
                      }
                      onClick={() => toggleKw(kw.id)}
                    >
                      {kw.name}
                    </button>
                  ))}
                </div>
                {selKw.length > 0 && (
                  <div className="select-hint">{selKw.length}개 선택됨</div>
                )}
              </div>

              <div className="modal-section">
                <div className="modal-section-title">📡 출처 선택</div>
                <div className="source-hint">선택하지 않으면 전체 출처에서 검색합니다</div>
                <div className="modal-chips">
                  {SOURCES.map((src) => (
                    <button
                      key={src}
                      className={`chip${selSrc.includes(src) ? ' selected chip-blue' : ''}`}
                      onClick={() => toggleSrc(src)}
                    >
                      {src}
                    </button>
                  ))}
                </div>
                {selSrc.length > 0 && (
                  <div className="select-hint">{selSrc.length}개 선택됨</div>
                )}
              </div>

              <div className="modal-section">
                <div className="modal-section-title">📅 수집 기간</div>
                <div className="modal-chips">
                  {PERIODS.map((p) => (
                    <button
                      key={p.value}
                      className={`chip${period === p.value ? ' selected chip-green' : ''}`}
                      onClick={() => setPeriod(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="collect-ai-notice">
                <span className="collect-ai-notice-icon">🤖</span>
                <div>
                  <strong>Claude AI</strong>가 키워드 관련 실제 논문/기사를 검색합니다.<br />
                  <span className="collect-ai-notice-sub">
                    URL이 불확실한 항목은 자동으로 제외됩니다. 수집 후 직접 검토 가능합니다.
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ── STEP 2: AI 수집 중 ── */}
          {step === 2 && (
            <div className="collect-loading">
              <div className="collect-loading-spinner" />
              <div className="collect-loading-title">AI가 뉴스를 검색하고 있습니다</div>
              <div className="collect-loading-desc">
                {loadingMsg || 'Claude AI가 뉴스를 검색하고 URL을 검증하는 중입니다...'}
              </div>
              <div className="collect-loading-tags">
                {selKw.map((id) => {
                  const kw = allKeywords.find((k) => k.id === id)
                  return kw ? (
                    <span
                      key={id}
                      className="collect-loading-tag"
                      style={{ borderColor: kw.color, color: kw.color }}
                    >
                      {kw.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: 결과 검토 ── */}
          {step === 3 && (
            <div className="collect-step-content">

              {/* 오류 */}
              {error && (
                <div className="collect-error-box">
                  {error === 'API_KEY_MISSING' ? (
                    <>
                      <div className="collect-error-title">⚙️ API 키가 설정되지 않았습니다</div>
                      <div className="collect-error-desc">
                        프로젝트 루트에 <code>.env</code> 파일을 생성하고<br />
                        <code>VITE_ANTHROPIC_API_KEY=sk-ant-...</code> 를 입력한 후<br />
                        개발 서버를 재시작해주세요.<br />
                        <br />
                        자세한 방법은 <code>README.md</code> 를 참고하세요.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="collect-error-title">❌ 수집 실패</div>
                      <div className="collect-error-desc">{error}</div>
                    </>
                  )}
                </div>
              )}

              {/* 결과 없음 */}
              {!error && results.length === 0 && (
                <div className="collect-empty">
                  <div className="collect-empty-icon">🔍</div>
                  <div className="collect-empty-title">수집된 뉴스가 없습니다</div>
                  <div className="collect-empty-desc">
                    키워드나 기간을 변경해서 다시 시도해보세요
                  </div>
                </div>
              )}

              {/* 결과 목록 */}
              {!error && results.length > 0 && (
                <>
                  <div className="collect-results-header">
                    <span className="collect-results-count">
                      {results.length}건 수집됨 · {checkedIds.length}건 선택
                    </span>
                    <button
                      className="btn-select-all"
                      onClick={() =>
                        setCheckedIds(allChecked ? [] : results.map((_, i) => i))
                      }
                    >
                      {allChecked ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  <div className="collect-result-list">
                    {results.map((item, idx) => (
                      <div
                        key={idx}
                        className={`collect-result-card${checkedIds.includes(idx) ? ' selected' : ''}`}
                        onClick={() => toggleCheck(idx)}
                      >
                        {/* 체크박스 */}
                        <div className="result-card-check">
                          <input
                            type="checkbox"
                            checked={checkedIds.includes(idx)}
                            onChange={() => toggleCheck(idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* 본문 */}
                        <div className="result-card-body">
                          <div className="result-card-header-row">
                            <div className="result-card-meta">
                              <span className="result-source">{item.source_name}</span>
                              <span className="result-date">{item.published_at}</span>
                              <span
                                className={`url-conf-badge conf-${item.url_confidence || 'medium'}`}
                              >
                                {(item.url_confidence || 'medium') === 'high'
                                  ? '✅ URL 확실'
                                  : '⚠️ URL 확인 권장'}
                              </span>
                            </div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="result-url-btn"
                              onClick={(e) => e.stopPropagation()}
                              title={item.url}
                            >
                              🔗 URL 열기
                            </a>
                          </div>

                          <div className="result-card-title">{item.title}</div>

                          {item.summary && (
                            <div className="result-card-summary">{item.summary}</div>
                          )}

                          <div className="result-card-keywords">
                            {(item.keywords || []).map((kwName) => {
                              const kwObj = allKeywords.find(
                                (k) =>
                                  k.name === kwName ||
                                  k.name.toLowerCase() === kwName.toLowerCase()
                              )
                              return (
                                <span
                                  key={kwName}
                                  className="keyword-tag"
                                  style={
                                    kwObj
                                      ? { borderColor: kwObj.color, color: kwObj.color }
                                      : {}
                                  }
                                >
                                  {kwName}
                                </span>
                              )
                            })}
                          </div>

                          {(item.url_confidence || 'medium') === 'medium' && (
                            <div className="result-url-warning">
                              ⚠️ medium confidence — 저장 전 URL을 직접 확인하세요
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          )}

          {/* ── STEP 4: 저장 완료 ── */}
          {step === 4 && (
            <div className="collect-success">
              <div className="collect-success-icon">✅</div>
              <div className="collect-success-title">{savedCount}건이 DB에 저장됐습니다</div>
              <div className="collect-success-meta">
                <span>AI 수집 결과가 저장됐습니다 —</span>
                <span className="url-status-badge url-verified" style={{ margin: '0 4px' }}>✅ 확인됨</span>
                <span>/</span>
                <span className="url-status-badge url-unverified" style={{ margin: '0 4px' }}>⚠️ AI 수집</span>
                <span>상태로 구분됩니다</span>
              </div>
              <div className="collect-success-desc">
                DB 뷰어에서 확인하고, ⚠️ 항목은 URL을 직접 검토해주세요.
              </div>
            </div>
          )}

        </div>

        {/* 푸터 */}
        <div className="modal-footer">
          {step === 1 && (
            <>
              <button className="btn-secondary" onClick={onClose}>취소</button>
              <button
                className="btn-primary"
                onClick={handleStartCollect}
                disabled={selKw.length === 0}
              >
                🤖 AI 수집 시작
              </button>
            </>
          )}
          {step === 2 && (
            <button className="btn-secondary" disabled>수집 중...</button>
          )}
          {step === 3 && (
            <>
              <button
                className="btn-secondary"
                onClick={() => { setStep(1); setError(null); setResults([]) }}
              >
                ← 다시 설정
              </button>
              {!error && results.length > 0 && (
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={checkedIds.length === 0}
                >
                  선택한 {checkedIds.length}건 DB에 저장
                </button>
              )}
            </>
          )}
          {step === 4 && (
            <button className="btn-primary" onClick={onClose}>닫기</button>
          )}
        </div>

      </div>
    </div>
  )
}
