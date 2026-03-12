import React, { useState, useRef } from 'react'
import { getKeywords, getTopicGroups, addNews, getNewsKeywords, setNewsKeywords } from '../data/db'

function getCurrentWeekLabel() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

const STEP_LABELS = ['URL 입력', '정보 입력', '저장 완료']

export default function CollectModal({ onClose, onCollected }) {
  const keywords = getKeywords()
  const topicGroups = getTopicGroups()

  const [step, setStep] = useState(1)

  // Step 1
  const [url, setUrl] = useState('')
  const urlInputRef = useRef(null)

  // Step 2
  const [confirmed, setConfirmed] = useState(false)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [publishedAt, setPublishedAt] = useState(
    () => new Date().toISOString().split('T')[0]
  )
  const [selKw, setSelKw] = useState([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [topicGroupId, setTopicGroupId] = useState('')

  // ── Step 1 핸들러 ──────────────────────────
  const handleOpenUrl = () => {
    if (!url.trim()) return
    window.open(url.trim(), '_blank', 'noopener,noreferrer')
  }

  const handleStep1Next = () => {
    if (!url.trim()) return
    setStep(2)
  }

  // ── Step 2 핸들러 ──────────────────────────
  const toggleKw = (id) =>
    setSelKw((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const canSave = confirmed && title.trim() && sourceName.trim() && publishedAt

  const handleSave = () => {
    if (!canSave) return

    const newItem = {
      title: title.trim(),
      summary: summary.trim(),
      url: url.trim(),
      source_name: sourceName.trim(),
      published_at: publishedAt,
      topic_group_id: topicGroupId ? parseInt(topicGroupId) : null,
      week_label: getCurrentWeekLabel(),
      is_featured: isFeatured,
      is_bookmarked: false,
      notes: '',
      url_status: 'verified',
    }

    const added = addNews(newItem)

    if (selKw.length > 0) {
      const nkList = getNewsKeywords()
      setNewsKeywords([
        ...nkList,
        ...selKw.map((kwId) => ({ news_id: added.id, keyword_id: kwId })),
      ])
    }

    setStep(3)
    onCollected && onCollected()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal collect-modal-v2" onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="modal-header">
          <h2>📰 뉴스 추가</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="collect-steps">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1
            return (
              <React.Fragment key={s}>
                <div
                  className={`collect-step-item${step >= s ? ' active' : ''}${step > s ? ' done' : ''}`}
                >
                  <div className="collect-step-circle">
                    {step > s ? '✓' : s}
                  </div>
                  <div className="collect-step-label">{label}</div>
                </div>
                {i < 2 && <div className={`collect-step-line${step > s ? ' done' : ''}`} />}
              </React.Fragment>
            )
          })}
        </div>

        {/* 바디 */}
        <div className="modal-body">

          {/* ── STEP 1: URL 입력 ── */}
          {step === 1 && (
            <div className="collect-step-content">
              <div className="collect-notice">
                <span className="collect-notice-icon">🔒</span>
                <span>
                  AI가 내용을 자동 생성하지 않습니다.<br />
                  반드시 실제 URL에 직접 접속해 확인한 내용만 입력해주세요.
                </span>
              </div>

              <div className="modal-section">
                <label className="modal-label">뉴스 URL</label>
                <div className="url-input-row">
                  <input
                    ref={urlInputRef}
                    className="modal-input"
                    type="url"
                    placeholder="https://www.nejm.org/doi/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1Next()}
                    autoFocus
                  />
                  <button
                    className="btn-open-url"
                    onClick={handleOpenUrl}
                    disabled={!url.trim()}
                    title="새 탭에서 열기"
                  >
                    🔗 열기
                  </button>
                </div>
                {url.trim() && (
                  <div className="url-hint">
                    ↑ "열기" 버튼으로 URL이 실제로 접속되는지 먼저 확인하세요
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: 정보 직접 입력 ── */}
          {step === 2 && (
            <div className="collect-step-content">

              {/* URL 표시 */}
              <div className="collect-url-display">
                <span className="collect-url-label">URL</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="collect-url-link"
                >
                  {url.length > 65 ? url.slice(0, 65) + '…' : url}
                </a>
              </div>

              {/* 접속 확인 체크박스 */}
              <label className="collect-confirm-check">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span>위 URL에 직접 접속해서 내용을 확인했습니다</span>
              </label>

              {/* 입력 폼 (체크 전엔 비활성) */}
              <div className={`collect-form${!confirmed ? ' form-locked' : ''}`}>

                <div className="modal-section">
                  <label className="modal-label">
                    제목 <span className="label-required">*</span>
                  </label>
                  <input
                    className="modal-input"
                    type="text"
                    placeholder="논문/기사 제목을 원문 그대로 입력"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!confirmed}
                  />
                </div>

                <div className="modal-section">
                  <label className="modal-label">
                    요약
                    <span className="label-charcount">
                      {summary.length} / 200자
                    </span>
                  </label>
                  <textarea
                    className="modal-input modal-textarea"
                    placeholder="핵심 내용을 직접 요약해주세요 (200자 이내)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value.slice(0, 200))}
                    rows={3}
                    disabled={!confirmed}
                  />
                </div>

                <div className="collect-row-2">
                  <div className="modal-section">
                    <label className="modal-label">
                      출처명 <span className="label-required">*</span>
                    </label>
                    <input
                      className="modal-input"
                      type="text"
                      placeholder="NEJM, Nature, FDA…"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      disabled={!confirmed}
                    />
                  </div>
                  <div className="modal-section">
                    <label className="modal-label">
                      발행일 <span className="label-required">*</span>
                    </label>
                    <input
                      className="modal-input"
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      disabled={!confirmed}
                    />
                  </div>
                </div>

                <div className="modal-section">
                  <label className="modal-label">키워드</label>
                  <div className="modal-chips">
                    {keywords.map((kw) => (
                      <button
                        key={kw.id}
                        type="button"
                        className={`chip${selKw.includes(kw.id) ? ' selected' : ''}`}
                        style={
                          selKw.includes(kw.id)
                            ? { background: kw.color, borderColor: kw.color, color: '#fff' }
                            : { borderColor: kw.color, color: kw.color }
                        }
                        onClick={() => toggleKw(kw.id)}
                        disabled={!confirmed}
                      >
                        {kw.name}
                      </button>
                    ))}
                  </div>
                </div>

                {topicGroups.length > 0 && (
                  <div className="modal-section">
                    <label className="modal-label">토픽 그룹 (선택)</label>
                    <select
                      className="modal-input modal-select"
                      value={topicGroupId}
                      onChange={(e) => setTopicGroupId(e.target.value)}
                      disabled={!confirmed}
                    >
                      <option value="">— 미지정 —</option>
                      {topicGroups.map((tg) => (
                        <option key={tg.id} value={tg.id}>
                          {tg.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="modal-section">
                  <label className="collect-featured-toggle">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      disabled={!confirmed}
                    />
                    <span>✦ 주간 브리핑 주요 뉴스로 선정</span>
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* ── STEP 3: 저장 완료 ── */}
          {step === 3 && (
            <div className="collect-success">
              <div className="collect-success-icon">✅</div>
              <div className="collect-success-title">검증된 뉴스가 저장됐습니다</div>
              <div className="collect-success-meta">
                <span className="url-status-badge url-verified">✅ 확인됨</span>
                <span>상태로 DB에 저장됐습니다</span>
              </div>
              <div className="collect-success-desc">"{title}"</div>
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
                onClick={handleStep1Next}
                disabled={!url.trim()}
              >
                다음 →
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn-secondary" onClick={() => setStep(1)}>← 이전</button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!canSave}
              >
                DB에 저장
              </button>
            </>
          )}
          {step === 3 && (
            <button className="btn-primary" onClick={onClose}>닫기</button>
          )}
        </div>

      </div>
    </div>
  )
}
