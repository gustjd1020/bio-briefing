import React, { useState, useRef } from 'react'
import { getKeywords, addNews, getNewsKeywords, setNewsKeywords } from '../data/db'

const SOURCES = [
  { id: 'nature', name: 'Nature' },
  { id: 'pubmed', name: 'PubMed' },
  { id: 'nejm', name: 'NEJM' },
  { id: 'lancet', name: 'Lancet' },
  { id: 'dong-a', name: '동아사이언스' },
  { id: 'biorxiv', name: 'bioRxiv' },
  { id: 'stat', name: 'STAT News' },
]

function getCurrentWeekLabel() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export default function CollectModal({ onClose, onCollected }) {
  const keywords = getKeywords()
  const [selKw, setSelKw] = useState([])
  const [selSrc, setSelSrc] = useState([])
  const [period, setPeriod] = useState('7')
  const [logs, setLogs] = useState([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const logRef = useRef(null)

  const addLog = (msg, type = 'info') => {
    setLogs((prev) => {
      const next = [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]
      setTimeout(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
      }, 50)
      return next
    })
  }

  const toggleKw = (id) =>
    setSelKw((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const toggleSrc = (id) =>
    setSelSrc((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const handleCollect = async () => {
    if (selKw.length === 0 || selSrc.length === 0) {
      alert('키워드와 출처를 하나 이상 선택해주세요.')
      return
    }
    setRunning(true)
    setLogs([])

    addLog('⚡ 뉴스 수집 시작...', 'info')
    await sleep(400)

    for (const srcId of selSrc) {
      const src = SOURCES.find((s) => s.id === srcId)
      addLog(`🔍 ${src.name} 연결 중...`, 'info')
      await sleep(300 + Math.random() * 200)
      addLog(`✅ ${src.name} 연결 성공`, 'success')
      await sleep(200)

      for (const kwId of selKw) {
        const kw = keywords.find((k) => k.id === kwId)
        addLog(`   📡 "${kw.name}" 검색 중 (${src.name})...`, 'info')
        await sleep(400 + Math.random() * 300)

        const count = Math.floor(Math.random() * 3) + 1
        addLog(`   📰 ${count}건 발견`, 'success')

        for (let i = 0; i < count; i++) {
          const newItem = generateDummyNews(src.name, kw.name)
          const added = addNews(newItem)
          const nkList = getNewsKeywords()
          setNewsKeywords([...nkList, { news_id: added.id, keyword_id: kwId }])
          await sleep(100)
        }
      }
    }

    await sleep(300)
    addLog('', '')
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'divider')
    addLog('✨ 수집 완료! 새로운 기사가 추가됐습니다.', 'done')
    setRunning(false)
    setDone(true)
    onCollected && onCollected()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚡ 뉴스 수집</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* 키워드 선택 */}
          <div className="modal-section">
            <div className="modal-section-title">🏷️ 키워드 선택</div>
            <div className="modal-chips">
              {keywords.map((kw) => (
                <button
                  key={kw.id}
                  className={`chip${selKw.includes(kw.id) ? ' selected' : ''}`}
                  style={selKw.includes(kw.id) ? { background: kw.color, borderColor: kw.color, color: '#fff' } : { borderColor: kw.color, color: kw.color }}
                  onClick={() => toggleKw(kw.id)}
                >
                  {kw.name}
                </button>
              ))}
            </div>
          </div>

          {/* 출처 선택 */}
          <div className="modal-section">
            <div className="modal-section-title">📡 출처 선택</div>
            <div className="modal-chips">
              {SOURCES.map((src) => (
                <button
                  key={src.id}
                  className={`chip${selSrc.includes(src.id) ? ' selected chip-blue' : ''}`}
                  onClick={() => toggleSrc(src.id)}
                >
                  {src.name}
                </button>
              ))}
            </div>
          </div>

          {/* 기간 선택 */}
          <div className="modal-section">
            <div className="modal-section-title">📅 수집 기간</div>
            <div className="modal-chips">
              {['1', '3', '7', '14', '30'].map((d) => (
                <button
                  key={d}
                  className={`chip${period === d ? ' selected chip-green' : ''}`}
                  onClick={() => setPeriod(d)}
                >
                  최근 {d}일
                </button>
              ))}
            </div>
          </div>

          {/* 로그 영역 */}
          {logs.length > 0 && (
            <div className="collect-log" ref={logRef}>
              {logs.map((l, i) => (
                <div key={i} className={`log-line log-${l.type}`}>
                  {l.ts && <span className="log-ts">[{l.ts}]</span>}
                  {' '}{l.msg}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {done ? (
            <button className="btn-primary" onClick={onClose}>닫기</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={onClose} disabled={running}>취소</button>
              <button className="btn-primary" onClick={handleCollect} disabled={running}>
                {running ? '수집 중...' : '수집 시작'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── 헬퍼 ────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const FAKE_TITLES = [
  'Phase 3 임상시험에서 유의미한 PFS 개선 확인',
  '신규 바이오마커 발굴로 치료 반응 예측 가능성 제시',
  '단일세포 RNA 시퀀싱으로 내성 기전 규명',
  '오가노이드 모델에서 약물 유효성 검증',
  '실세계데이터(RWD) 분석으로 효능 재확인',
  '멀티오믹스 통합 분석으로 새로운 치료 표적 발굴',
  '환자 유래 이종이식(PDX) 모델에서 상승효과 확인',
]

function generateDummyNews(source, keyword) {
  const title = `[${keyword}] ${FAKE_TITLES[Math.floor(Math.random() * FAKE_TITLES.length)]}`
  const now = new Date()
  const date = new Date(now - Math.random() * 7 * 86400000)
  const dateStr = date.toISOString().split('T')[0]
  const year = date.getFullYear()
  const start = new Date(year, 0, 1)
  const week = Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7)
  const weekLabel = `${year}-W${String(week).padStart(2, '0')}`

  return {
    title,
    summary: `${source}에서 수집된 ${keyword} 관련 최신 연구 결과입니다. 자세한 내용은 원문을 참조하세요.`,
    url: '#',
    source_name: source,
    published_at: dateStr,
    topic_group_id: null,
    week_label: weekLabel,
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  }
}
