// Google Sheets 연동 — Apps Script 웹 앱 방식
// VITE_SHEETS_URL: .env 파일에 설정된 Apps Script 배포 URL

const API = import.meta.env.VITE_SHEETS_URL

/**
 * 시트의 모든 행을 { colName: value, ... }[] 형태로 반환
 * Apps Script 웹 앱 GET 요청 → { data: [...] }
 */
export async function getSheet(sheet) {
  if (!API) throw new Error('VITE_SHEETS_URL이 설정되지 않았습니다')
  const res = await fetch(`${API}?method=GET&sheet=${encodeURIComponent(sheet)}`)
  const json = await res.json()
  return json.data || []
}

/**
 * 시트에 행 1개 추가
 * Apps Script 웹 앱 POST 요청 → { method, sheet, row }
 */
export async function appendToSheet(sheet, row) {
  if (!API) throw new Error('VITE_SHEETS_URL이 설정되지 않았습니다')
  await fetch(API, {
    method: 'POST',
    body: JSON.stringify({ method: 'POST', sheet, row }),
  })
}
