import React, { useMemo, useState } from 'react'
import { getKeywordsForNews } from '../data/db'
import NewsCard from './NewsCard'

export default function AllNews({ news, keywords, onUpdate }) {
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // keyword priority 맵
  const kwPriorityMap = useMemo(() => {
    const m = {}
    keywords.forEach((k) => { m[k.id] = k.priority })
    return m
  }, [keywords])

  // 기사마다 최소 priority 계산
  const scored = useMemo(() => {
    return news.map((n) => {
      const kws = getKeywordsForNews(n.id)
      const minP = kws.length
        ? Math.min(...kws.map((k) => kwPriorityMap[k.id] ?? 999))
        : 999
      return { ...n, _minPriority: minP }
    })
  }, [news, kwPriorityMap])

  const filtered = useMemo(() => {
    let list = scored
    if (showBookmarked) list = list.filter((n) => n.is_bookmarked)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.source_name.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => a._minPriority - b._minPriority || b.published_at.localeCompare(a.published_at))
  }, [scored, showBookmarked, searchQuery])

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📰 전체 뉴스</h2>
        <span className="tab-count">총 {filtered.length}건</span>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 제목·요약·출처 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={`btn-filter${showBookmarked ? ' active' : ''}`}
          onClick={() => setShowBookmarked((v) => !v)}
        >
          🔖 북마크만
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>조건에 맞는 기사가 없습니다.</p>
        </div>
      ) : (
        <div className="news-list">
          {filtered.map((n) => (
            <NewsCard key={n.id} news={n} keywords={keywords} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
