import React from 'react'

export default function Header({ onCollect, theme }) {
  const isDark = theme === 'dark'
  const logoSrc = isDark ? '/ablbio-logo-white.png' : '/ablbio-logo.png'

  return (
    <header className="header">
      <div className="header-quote">
        <span className="header-quote-icon">✦</span>
        &ldquo;거인의 어깨에 올라서서 더 넓은 세상을 바라보라&rdquo; &mdash; 아이작 뉴턴
      </div>
      <div className="header-main">
        <div className="header-logo">
          <img
            src={logoSrc}
            alt="ABL Bio"
            className="header-logo-img"
          />
          <span className="header-logo-divider" />
          <span className="header-logo-service">BioNews</span>
          <span className="header-logo-sub">AI/바이오 인텔리전스</span>
        </div>
        <button className="btn-collect" onClick={onCollect}>
          <span>⚡</span> 뉴스 수집
        </button>
      </div>
    </header>
  )
}
