# BioNews — ABL Bio AI/바이오 인텔리전스 브리핑

ABL Bio 내부 전용 뉴스 브리핑 서비스입니다.

## 실행

```bash
npm install
npm run dev
```

## Claude API 설정 (AI 뉴스 수집 기능)

`⚡ 뉴스 수집` 버튼의 AI 자동 수집 기능을 사용하려면 Anthropic Claude API 키가 필요합니다.

### 1. `.env` 파일 생성

프로젝트 루트(이 README와 같은 폴더)에 `.env` 파일을 만들고 아래 내용을 입력하세요:

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 2. API 키 발급

[Anthropic Console](https://console.anthropic.com) → API Keys → Create Key

### 3. 개발 서버 재시작

`.env` 파일 생성 후 반드시 개발 서버를 재시작하세요:

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

### 보안 안내

- `.env` 파일은 `.gitignore`에 포함되어 있어 **절대 GitHub에 업로드되지 않습니다**
- API 키는 팀 내부에서만 공유하세요
- Vite 개발 서버가 API 프록시 역할을 하므로 반드시 `npm run dev`로 실행해야 합니다

## 기술 스택

- React 18 + Vite 5
- localStorage 기반 DB (News / Keyword / NewsKeyword / TopicGroup)
- Claude API (claude-3-5-sonnet) — AI 뉴스 수집
- CSS Custom Properties (다크/라이트 테마)

## 팀 비밀번호

`ablbio2026`
