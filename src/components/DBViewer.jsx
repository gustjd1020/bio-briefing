import React, { useState, useMemo } from 'react'
import {
  getNews, getKeywords, getNewsKeywords, getTopicGroups,
  downloadCSV, downloadAllAsZip,
} from '../data/db'

const SUBTABS = [
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'keyword', label: 'Keyword', icon: '🏷️' },
  { id: 'newsKeyword', label: 'NewsKeyword', icon: '🔗' },
  { id: 'topicGroup', label: 'TopicGroup', icon: '🗂️' },
]

// url_status 표시 기준:
// verified → ✅ 확인됨 (사용자가 직접 접속 확인)
// unknown  → ⚠️ 미확인
// error    → ❌ 오류 (접속 불가 확인)
const URL_STATUS_BADGE = {
  verified: { icon: '✅', label: '확인됨',  className: 'url-verified' },
  unknown:  { icon: '⚠️', label: '미확인',  className: 'url-unknown' },
  error:    { icon: '❌', label: '오류',    className: 'url-error' },
}

function TableView({ data, tableName, weekLabel }) {
  const [showJson, setShowJson] = useState(false)

  const columns = useMemo(() => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }, [data])

  const filename = tableName === 'news'
    ? `news_${weekLabel || 'all'}.csv`
    : `${tableName}.csv`

  return (
    <div className="db-table-wrap">
      <div className="db-table-topbar">
        <span className="db-row-count">총 {data.length}건</span>
        <div className="db-table-actions">
          <button
            className="btn-json-toggle"
            onClick={() => setShowJson((v) => !v)}
          >
            {showJson ? '▲ JSON 접기' : '▼ JSON 보기'}
          </button>
          <button
            className="btn-csv"
            onClick={() => downloadCSV(data, filename)}
          >
            📥 CSV
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="db-empty">데이터 없음</div>
      ) : (
        <div className="db-scroll">
          <table className="db-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri}>
                  {columns.map((col) => (
                    <td key={col}>
                      {formatCell(row[col], col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showJson && (
        <div className="db-json-view">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

function formatCell(val, col) {
  if (val === null || val === undefined) return <span className="db-null">NULL</span>
  if (typeof val === 'boolean') return <span className={`db-bool db-bool-${val}`}>{val ? 'true' : 'false'}</span>
  if (col === 'url_status') {
    const badge = URL_STATUS_BADGE[val] || URL_STATUS_BADGE.unknown
    return (
      <span className={`url-status-badge ${badge.className}`}>
        {badge.icon} {badge.label}
      </span>
    )
  }
  if (col === 'url' && val && val !== '#') {
    return (
      <a href={val} target="_blank" rel="noopener noreferrer" className="db-link">
        {val.length > 40 ? val.slice(0, 40) + '…' : val}
      </a>
    )
  }
  if (col === 'color') {
    return (
      <span className="db-color-cell">
        <span className="db-color-dot" style={{ background: val }} />
        {val}
      </span>
    )
  }
  const str = String(val)
  return str.length > 60 ? str.slice(0, 60) + '…' : str
}

export default function DBViewer({ refreshTrigger }) {
  const [activeTab, setActiveTab] = useState('news')

  const getData = () => {
    switch (activeTab) {
      case 'news': return getNews()
      case 'keyword': return getKeywords()
      case 'newsKeyword': return getNewsKeywords()
      case 'topicGroup': return getTopicGroups()
      default: return []
    }
  }

  const data = useMemo(getData, [activeTab, refreshTrigger])

  const currentWeek = useMemo(() => {
    const news = getNews()
    const weeks = [...new Set(news.map((n) => n.week_label))].filter(Boolean)
    return weeks.sort().reverse()[0] || 'all'
  }, [refreshTrigger])

  return (
    <div className="tab-content db-viewer">
      <div className="tab-header">
        <h2>🗄️ DB 뷰어</h2>
        <button className="btn-export-all" onClick={downloadAllAsZip}>
          📊 전체 내보내기
        </button>
      </div>

      <div className="db-subtabs">
        {SUBTABS.map((t) => (
          <button
            key={t.id}
            className={`db-subtab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <TableView
        data={data}
        tableName={activeTab}
        weekLabel={currentWeek}
      />
    </div>
  )
}
