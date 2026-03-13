/**
 * Vercel Serverless Function — Google Sheets API 프록시
 *
 * 필요한 환경 변수 (Vercel 대시보드 > Settings > Environment Variables):
 *   GOOGLE_SHEETS_ID               : 스프레드시트 ID (URL의 /d/XXXXX/ 부분)
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   : 서비스 계정 이메일
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY : 서비스 계정 Private Key (\n을 리터럴 \n으로 저장)
 *
 * GET  /api/sheets?sheet=News          → 해당 시트 전체 rows 반환
 * POST /api/sheets?sheet=News  body: { rows: [[col1,col2,...], ...] } → 행 추가
 */

import crypto from 'crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

function b64url(input) {
  const str = typeof input === 'string' ? input : JSON.stringify(input)
  return Buffer.from(str).toString('base64url')
}

async function getAccessToken(email, privateKey) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url({ alg: 'RS256', typ: 'JWT' })
  const claim = b64url({
    iss: email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  })
  const unsigned = `${header}.${claim}`
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(unsigned)
  const sig = sign.sign(privateKey, 'base64url')
  const jwt = `${unsigned}.${sig}`

  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await resp.json()
  if (!data.access_token) {
    throw new Error(`Google OAuth 실패: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sheetId = process.env.GOOGLE_SHEETS_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n')

  // ── 헬스체크: ?ping=1 → 환경변수 설정 여부만 확인 ──────────────
  if (req.query.ping === '1') {
    const configured = !!(sheetId && email && privateKey)
    return res.status(200).json({ ok: configured, configured })
  }

  if (!sheetId || !email || !privateKey) {
    return res.status(500).json({ error: 'Google Sheets 환경 변수가 설정되지 않았습니다.' })
  }

  const sheet = req.query.sheet
  if (!sheet) {
    return res.status(400).json({ error: 'sheet 쿼리 파라미터가 필요합니다.' })
  }

  try {
    const token = await getAccessToken(email, privateKey)
    const auth = { Authorization: `Bearer ${token}` }

    // ── GET: 시트 전체 rows 반환 ──────────────────────────────
    if (req.method === 'GET') {
      const url = `${BASE}/${sheetId}/values/${encodeURIComponent(sheet)}!A:Z`
      const r = await fetch(url, { headers: auth })
      const data = await r.json()
      return res.status(r.status).json(data)
    }

    // ── POST: 행 추가 ─────────────────────────────────────────
    if (req.method === 'POST') {
      const { rows } = req.body
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: 'rows 배열이 필요합니다.' })
      }
      const url =
        `${BASE}/${sheetId}/values/${encodeURIComponent(sheet)}!A1:append` +
        `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`
      const r = await fetch(url, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows }),
      })
      const data = await r.json()
      return res.status(r.status).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
