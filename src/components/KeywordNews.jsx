import React, { useMemo } from 'react'
import { getNewsForKeyword } from '../data/db'
import NewsCard from './NewsCard'

export default function KeywordNews({ keywords, allNews, selectedKeywordId, onSelectKeyword, onUpdate }) {
  const sorted = useMemo(
    () => [...keywords].sort((a, b) => a.priority - b.priority),
    [keywords]
  )

  const selectedKw = keywords.find((k) => k.id === selectedKeywordId)

  const filteredNews = useMemo(() => {
    if (!selectedKeywordId) return []
    return getNewsForKeyword(selectedKeywordId).sort((a, b) =>
      b.published_at.localeCompare(a.published_at)
    )
  }, [selectedKeywordId, allNews])

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>🔖 키워드별 뉴스</h2>
        {selectedKw && (
          <span className="tab-count" style={{ borderColor: selectedKw.color, color: selectedKw.color }}>
            {selectedKw.name} · {filteredNews.length}건
          </span>
        )}
      </div>

      {!selectedKeywordId ? (
        <div className="keyword-grid-area">
          <p className="keyword-grid-hint">키워드를 선택하면 해당 뉴스만 표시됩니다.</p>
          <div className="keyword-grid">
            {sorted.map((kw) => {
              const count = getNewsForKeyword(kw.id).length
              return (
                <button
                  key={kw.id}
                  className="keyword-card"
                  style={{ '--kw-color': kw.color }}
                  onClick={() => onSelectKeyword(kw.id)}
                >
                  <span
                    className="keyword-card-dot"
                    style={{ background: kw.color }}
                  />
                  <span className="keyword-card-name">{kw.name}</span>
                  <span className="keyword-card-count">{count}건</span>
                  <span className="keyword-card-priority">우선순위 {kw.priority}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div>
          <button
            className="btn-back"
            onClick={() => onSelectKeyword(null)}
          >
            ← 모든 키워드 보기
          </button>

          <div
            className="selected-kw-banner"
            style={{ borderLeftColor: selectedKw?.color }}
          >
            <span
              className="keyword-dot-lg"
              style={{ background: selectedKw?.color }}
            />
            <span className="selected-kw-name">{selectedKw?.name}</span>
            <span className="selected-kw-count">{filteredNews.length}건의 기사</span>
          </div>

          {filteredNews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>해당 키워드의 기사가 없습니다.</p>
            </div>
          ) : (
            <div className="news-list">
              {filteredNews.map((n) => (
                <NewsCard key={n.id} news={n} onUpdate={onUpdate} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
