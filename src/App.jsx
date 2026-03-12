import React, { useState, useEffect, useCallback } from 'react'
import { getNews, getKeywords } from './data/db'
import { initDB } from './data/seed'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import WeeklyBriefing from './components/WeeklyBriefing'
import AllNews from './components/AllNews'
import KeywordNews from './components/KeywordNews'
import DBViewer from './components/DBViewer'
import CollectModal from './components/CollectModal'
import './App.css'

const TABS = [
  { id: 'briefing', label: '주간 브리핑', icon: '📋' },
  { id: 'all', label: '전체 뉴스', icon: '📰' },
  { id: 'keyword', label: '키워드별', icon: '🔖' },
  { id: 'db', label: 'DB 뷰어', icon: '🗄️' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing')
  const [news, setNews] = useState([])
  const [keywords, setKeywords] = useState([])
  const [selectedKeywordId, setSelectedKeywordId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dbRefresh, setDbRefresh] = useState(0)

  // ── 테마 ────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // 초기 DB 로드
  useEffect(() => {
    initDB()
    setNews(getNews())
    setKeywords(getKeywords())
  }, [])

  const refreshAll = useCallback(() => {
    setNews(getNews())
    setKeywords(getKeywords())
    setDbRefresh((v) => v + 1)
  }, [])

  const handleUpdate = useCallback(() => {
    setNews(getNews())
    setDbRefresh((v) => v + 1)
  }, [])

  const handleSelectKeyword = useCallback((id) => {
    setSelectedKeywordId(id)
    if (id !== null) setActiveTab('keyword')
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId !== 'keyword') setSelectedKeywordId(null)
  }

  return (
    <div className="app">
      <Header onCollect={() => setShowModal(true)} theme={theme} />

      <nav className="main-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => handleTabChange(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="main-layout">
        <Sidebar
          keywords={keywords}
          setKeywordsState={setKeywords}
          selectedKeywordId={selectedKeywordId}
          onSelectKeyword={handleSelectKeyword}
        />

        <main className="main-content">
          {activeTab === 'briefing' && (
            <WeeklyBriefing news={news} onUpdate={handleUpdate} />
          )}
          {activeTab === 'all' && (
            <AllNews news={news} keywords={keywords} onUpdate={handleUpdate} />
          )}
          {activeTab === 'keyword' && (
            <KeywordNews
              keywords={keywords}
              allNews={news}
              selectedKeywordId={selectedKeywordId}
              onSelectKeyword={handleSelectKeyword}
              onUpdate={handleUpdate}
            />
          )}
          {activeTab === 'db' && (
            <DBViewer refreshTrigger={dbRefresh} />
          )}
        </main>
      </div>

      {showModal && (
        <CollectModal
          onClose={() => setShowModal(false)}
          onCollected={refreshAll}
        />
      )}

      {/* ── 테마 토글 버튼 (우측 하단 고정) ── */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        aria-label="테마 전환"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
