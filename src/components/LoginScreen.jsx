import React, { useState, useRef, useEffect } from 'react'

const CORRECT_PW = 'ablbio2026'

export default function LoginScreen({ onSuccess, theme }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [show, setShow] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === CORRECT_PW) {
      setError(false)
      localStorage.setItem('auth', 'true')
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 500)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <div className="login-overlay">
      {/* 배경 파티클 효과 */}
      <div className="login-bg">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`login-orb login-orb-${i + 1}`} />
        ))}
      </div>

      <div className={`login-card${shake ? ' shake' : ''}`}>
        {/* 로고 */}
        <div className="login-logo">
          <img
            src={theme === 'dark' ? '/ablbio-logo-white.png' : '/ablbio-logo.png'}
            alt="ABL Bio"
            className="login-logo-img"
          />
        </div>

        <div className="login-divider-line" />

        {/* 서비스명 */}
        <div className="login-title">BioNews</div>
        <div className="login-subtitle">AI/바이오 인텔리전스 브리핑</div>

        {/* 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-wrap">
            <span className="login-input-icon">🔒</span>
            <input
              ref={inputRef}
              className={`login-input${error ? ' error' : ''}`}
              type={show ? 'text' : 'password'}
              placeholder="팀 비밀번호를 입력하세요"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-show-btn"
              onClick={() => setShow(v => !v)}
              tabIndex={-1}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <div className="login-error">
              ⚠️ 비밀번호가 틀렸습니다. 다시 입력해주세요.
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={!value}
          >
            입장하기 →
          </button>
        </form>

        <div className="login-footer">
          ABL Bio 내부 전용 서비스입니다
        </div>
      </div>
    </div>
  )
}
