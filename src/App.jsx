import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getNews, getKeywords } from './data/db'
import { initDB } from './data/seed'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import WeeklyBriefing from './components/WeeklyBriefing'
import AllNews from './components/AllNews'
import KeywordNews from './components/KeywordNews'
import DBViewer from './components/DBViewer'
import CollectModal from './components/CollectModal'
import LoginScreen from './components/LoginScreen'
import './App.css'

const TABS = [
  { id: 'briefing', label: '주간 브리핑', shortLabel: '브리핑', icon: '📋' },
  { id: 'all', label: '전체 뉴스', shortLabel: '전체', icon: '📰' },
  { id: 'keyword', label: '키워드별', shortLabel: '키워드', icon: '🔖' },
  { id: 'db', label: 'DB 뷰어', shortLabel: 'DB', icon: '🗄️' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing')
  const [news, setNews] = useState([])
  const [keywords, setKeywords] = useState([])
  const [selectedKeywordId, setSelectedKeywordId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dbRefresh, setDbRefresh] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ── 사이드바 너비 조절 ─────────────────────────
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : 220
  })
  const [dragging, setDragging] = useState(false)
  const sidebarWidthRef = useRef(sidebarWidth)

  const handleDividerMouseDown = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = sidebarWidthRef.current
    setDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (e) => {
      const newWidth = Math.min(400, Math.max(120, startWidth + e.clientX - startX))
      sidebarWidthRef.current = newWidth
      setSidebarWidth(newWidth)
    }
    const onUp = () => {
      setDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      localStorage.setItem('sidebarWidth', String(sidebarWidthRef.current))
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  // ── 인증 ────────────────────────────────────
  const [authed, setAuthed] = useState(() => {
    return localStorage.getItem('auth') === 'true'
  })

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

  // ── 미인증 시 로그인 화면 ────────────────────
  if (!authed) {
    return (
      <LoginScreen
        theme={theme}
        onSuccess={() => setAuthed(true)}
      />
    )
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
            <span className="nav-label-short">{t.shortLabel}</span>
          </button>
        ))}
      </nav>

      <div className="main-layout">
        <div className="sidebar-wrapper" style={{ width: sidebarWidth, minWidth: sidebarWidth }}>
          <Sidebar
            keywords={keywords}
            setKeywordsState={setKeywords}
            selectedKeywordId={selectedKeywordId}
            onSelectKeyword={handleSelectKeyword}
          />
        </div>
        <div
          className={`sidebar-divider${dragging ? ' dragging' : ''}`}
          onMouseDown={handleDividerMouseDown}
        />

        <main className="main-content">
          {/* 모바일 전용: 키워드 필터 버튼 */}
          <button className="mobile-filter-btn" onClick={() => setDrawerOpen(true)}>
            🔖 키워드 필터
          </button>

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

      {/* 모바일 사이드바 드로어 (바텀시트) */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span>🔖 키워드 필터</span>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <Sidebar
              keywords={keywords}
              setKeywordsState={setKeywords}
              selectedKeywordId={selectedKeywordId}
              onSelectKeyword={(id) => { handleSelectKeyword(id); setDrawerOpen(false) }}
            />
          </div>
        </div>
      )}

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
