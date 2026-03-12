import React from 'react'
import { updateKeywordPriority, setKeywords } from '../data/db'

export default function Sidebar({ keywords, setKeywordsState, selectedKeywordId, onSelectKeyword }) {
  const sorted = [...keywords].sort((a, b) => a.priority - b.priority)

  const handleMove = (id, direction) => {
    const updated = updateKeywordPriority(id, direction)
    setKeywordsState([...updated])
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span>🏷️</span> 키워드 필터
      </div>
      <div className="sidebar-hint">클릭하면 해당 뉴스만 표시</div>
      <ul className="keyword-list">
        {sorted.map((kw, idx) => (
          <li
            key={kw.id}
            className={`keyword-item${selectedKeywordId === kw.id ? ' active' : ''}`}
            onClick={() => onSelectKeyword(selectedKeywordId === kw.id ? null : kw.id)}
          >
            <span
              className="keyword-dot"
              style={{ background: kw.color }}
            />
            <span className="keyword-name">{kw.name}</span>
            <span className="keyword-priority">P{kw.priority}</span>
            <div className="keyword-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn-arrow"
                disabled={idx === 0}
                onClick={() => handleMove(kw.id, 'up')}
                title="우선순위 올리기"
              >
                ▲
              </button>
              <button
                className="btn-arrow"
                disabled={idx === sorted.length - 1}
                onClick={() => handleMove(kw.id, 'down')}
                title="우선순위 내리기"
              >
                ▼
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
