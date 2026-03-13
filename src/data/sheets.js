/**
 * Google Sheets 연동 유틸리티 (클라이언트 → /api/sheets 프록시 경유)
 *
 * Google Sheets 스프레드시트 구성:
 *   - "News"        시트: 아래 NEWS_COLUMNS 순서로 헤더 지정
 *   - "NewsKeywords" 시트: news_id, keyword_id 헤더 지정
 *
 * 서비스 계정 설정 후 스프레드시트에 편집 권한을 부여해야 합니다.
 */

// ── 컬럼 정의 ─────────────────────────────────────────────────
export const NEWS_COLUMNS = [
  'id', 'title', 'summary', 'url', 'source_name',
  'published_at', 'topic_group_id', 'week_label',
  'is_featured', 'is_bookmarked', 'notes', 'url_status',
]

export const NEWS_KW_COLUMNS = ['news_id', 'keyword_id']

// ── 저수준: rows 읽기 ─────────────────────────────────────────
/**
 * 시트의 모든 행을 { colName: value, ... }[] 형태로 반환.
 * 시트가 비어있으면 [] 반환.
 */
export async function getSheetRows(sheetName) {
  const res = await fetch(`/api/sheets?sheet=${encodeURIComponent(sheetName)}`)
  if (!res.ok) throw new Error(`시트 읽기 실패 (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || data.error)
  const [headers, ...rows] = data.values || []
  if (!headers) return []
  return rows.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
  )
}

// ── 저수준: rows 추가 ─────────────────────────────────────────
/**
 * 시트에 rows를 append.
 * rows: string[][] — 각 항목이 하나의 행
 */
export async function appendRows(sheetName, rows) {
  const res = await fetch(`/api/sheets?sheet=${encodeURIComponent(sheetName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  if (!res.ok) throw new Error(`시트 저장 실패 (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || data.error)
  return data
}

// ── 고수준: 뉴스 객체 → 행 변환 ──────────────────────────────
export function newsToRow(newsObj) {
  return NEWS_COLUMNS.map((col) => {
    const val = newsObj[col]
    if (val === null || val === undefined) return ''
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
    return String(val)
  })
}

// ── 고수준: NewsKeyword 객체 → 행 변환 ───────────────────────
export function newsKwToRow(nkObj) {
  return NEWS_KW_COLUMNS.map((col) => String(nkObj[col] ?? ''))
}

// ── 헬퍼: 시트의 최대 id 반환 ────────────────────────────────
export async function getSheetMaxId(sheetName = 'News') {
  const rows = await getSheetRows(sheetName)
  const ids = rows.map((r) => parseInt(r.id, 10)).filter((n) => !isNaN(n))
  return ids.length ? Math.max(...ids) : 0
}

// ── 헬퍼: 시트의 URL Set 반환 (중복 판단용) ──────────────────
export async function getSheetUrlSet(sheetName = 'News') {
  const rows = await getSheetRows(sheetName)
  return new Set(rows.map((r) => r.url).filter((u) => u && u !== '#'))
}

// ── 헬퍼: 시트의 제목 Set 반환 (URL 없는 항목 중복 판단용) ──
export async function getSheetTitleSet(sheetName = 'News') {
  const rows = await getSheetRows(sheetName)
  return new Set(rows.map((r) => r.title).filter(Boolean))
}
