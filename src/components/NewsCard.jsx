import React, { useState } from 'react'
import { updateNews, getKeywordsForNews } from '../data/db'

export default function NewsCard({ news, keywords, onUpdate, compact = false }) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteVal, setNoteVal] = useState(news.notes || '')

  const cardKeywords = keywords
    ? keywords.filter((k) =>
        getKeywordsForNews(news.id)
          .map((kw) => kw.id)
          .includes(k.id)
      )
    : getKeywordsForNews(news.id)

  const handleBookmark = (e) => {
    e.preventDefault()
    const updated = updateNews(news.id, { is_bookmarked: !news.is_bookmarked })
    onUpdate && onUpdate(updated)
  }

  const handleNoteSave = () => {
    const updated = updateNews(news.id, { notes: noteVal })
    onUpdate && onUpdate(updated)
    setEditingNote(false)
  }

  return (
    <div className={`news-card${news.is_featured ? ' featured' : ''}`}>
      <div className="news-card-top">
        <div className="news-card-meta">
          <span className="news-source">{news.source_name}</span>
          <span className="news-date">{news.published_at}</span>
          <span className="news-week">{news.week_label}</span>
        </div>
        <button
          className={`btn-bookmark${news.is_bookmarked ? ' active' : ''}`}
          onClick={handleBookmark}
          title={news.is_bookmarked ? '북마크 해제' : '북마크'}
        >
          {news.is_bookmarked ? '🔖' : '🔲'}
        </button>
      </div>

      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-title"
      >
        {news.is_featured && <span className="featured-badge">✦ 주요</span>}
        {news.title}
      </a>

      {!compact && (
        <p className="news-summary">{news.summary}</p>
      )}

      <div className="news-card-footer">
        <div className="news-keywords">
          {cardKeywords.map((kw) => (
            <span
              key={kw.id}
              className="keyword-tag"
              style={{ borderColor: kw.color, color: kw.color }}
            >
              {kw.name}
            </span>
          ))}
        </div>

        {!compact && (
          <div className="news-notes">
            {editingNote ? (
              <div className="notes-edit">
                <textarea
                  value={noteVal}
                  onChange={(e) => setNoteVal(e.target.value)}
                  placeholder="팀 메모를 입력하세요..."
                  rows={2}
                />
                <div className="notes-edit-actions">
                  <button className="btn-sm btn-save" onClick={handleNoteSave}>저장</button>
                  <button className="btn-sm btn-cancel" onClick={() => setEditingNote(false)}>취소</button>
                </div>
              </div>
            ) : (
              <div
                className={`notes-display${news.notes ? ' has-note' : ''}`}
                onClick={() => setEditingNote(true)}
              >
                {news.notes
                  ? <><span className="notes-icon">📝</span> {news.notes}</>
                  : <span className="notes-placeholder">+ 메모 추가</span>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
