// ─────────────────────────────────────────────
// localStorage DB 유틸리티
// ─────────────────────────────────────────────

const KEYS = {
  NEWS: 'news',
  KEYWORDS: 'keywords',
  NEWS_KEYWORDS: 'newsKeywords',
  TOPIC_GROUPS: 'topicGroups',
}

// ── 읽기 ────────────────────────────────────
export const getAll = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ── 쓰기 ────────────────────────────────────
export const setAll = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── News ─────────────────────────────────────
export const getNews = () => getAll(KEYS.NEWS)
export const setNews = (data) => setAll(KEYS.NEWS, data)

export const updateNews = (id, patch) => {
  const list = getNews()
  const updated = list.map((n) => (n.id === id ? { ...n, ...patch } : n))
  setNews(updated)
  return updated
}

export const addNews = (item) => {
  const list = getNews()
  // item.id가 이미 지정된 경우 그대로 사용 (Google Sheets 연동 시 외부에서 id 할당)
  const nextId = item.id != null
    ? item.id
    : (list.length ? Math.max(...list.map((n) => n.id)) + 1 : 1)
  const newItem = { ...item, id: nextId }
  setNews([...list, newItem])
  return newItem
}

// ── Keywords ─────────────────────────────────
export const getKeywords = () => getAll(KEYS.KEYWORDS)
export const setKeywords = (data) => setAll(KEYS.KEYWORDS, data)

export const updateKeywordPriority = (id, direction) => {
  const list = [...getKeywords()].sort((a, b) => a.priority - b.priority)
  const idx = list.findIndex((k) => k.id === id)
  if (idx === -1) return list
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= list.length) return list
  const p1 = list[idx].priority
  const p2 = list[swapIdx].priority
  list[idx] = { ...list[idx], priority: p2 }
  list[swapIdx] = { ...list[swapIdx], priority: p1 }
  setKeywords(list)
  return list
}

// ── NewsKeywords ──────────────────────────────
export const getNewsKeywords = () => getAll(KEYS.NEWS_KEYWORDS)
export const setNewsKeywords = (data) => setAll(KEYS.NEWS_KEYWORDS, data)

export const getKeywordsForNews = (newsId) => {
  const nk = getNewsKeywords()
  const kw = getKeywords()
  const ids = nk.filter((r) => r.news_id === newsId).map((r) => r.keyword_id)
  return kw.filter((k) => ids.includes(k.id))
}

export const getNewsForKeyword = (keywordId) => {
  const nk = getNewsKeywords()
  const news = getNews()
  const ids = nk.filter((r) => r.keyword_id === keywordId).map((r) => r.news_id)
  return news.filter((n) => ids.includes(n.id))
}

// ── TopicGroups ───────────────────────────────
export const getTopicGroups = () => getAll(KEYS.TOPIC_GROUPS)
export const setTopicGroups = (data) => setAll(KEYS.TOPIC_GROUPS, data)

// ── CSV 내보내기 유틸 ──────────────────────────
export const toCSV = (data) => {
  if (!data || data.length === 0) return ''
  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h] == null ? '' : String(row[h])
        return `"${val.replace(/"/g, '""')}"`
      })
      .join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export const downloadCSV = (data, filename) => {
  const csv = toCSV(data)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── ZIP 전체 내보내기 (순수 JS, jszip 없이) ────
export const downloadAllAsZip = async () => {
  // 각 테이블을 개별 CSV 파일로 다운로드 (zip 미지원 시 폴백)
  const tables = [
    { key: KEYS.NEWS, filename: 'news.csv' },
    { key: KEYS.KEYWORDS, filename: 'keywords.csv' },
    { key: KEYS.NEWS_KEYWORDS, filename: 'news_keywords.csv' },
    { key: KEYS.TOPIC_GROUPS, filename: 'topic_groups.csv' },
  ]
  for (const t of tables) {
    downloadCSV(getAll(t.key), t.filename)
    await new Promise((r) => setTimeout(r, 200))
  }
}

// ── url_status 값 정의 ────────────────────────
// 'verified'   : 사용자가 직접 URL에 접속해 확인한 것
// 'unverified' : AI 수집 medium confidence (URL 미확인)
// 'unknown'    : 아직 확인하지 않은 것 (기본값)
// 'error'      : 접속 불가 확인된 것

export { KEYS }
