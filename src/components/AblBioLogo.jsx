import React from 'react'

/**
 * ABL Bio 로고 인라인 SVG 컴포넌트
 * - 다크/라이트 테마에 따라 "abl" 글자색 자동 전환
 * - "bio" + 바/원 = 항상 ABL Bio 오렌지(#E8A428)
 * - tagline = 라이트: 검정/빨강, 다크: 연회색/빨강
 */
export default function AblBioLogo({ theme = 'dark', height = 52 }) {
  const isDark = theme === 'dark'
  const ablColor   = isDark ? '#d1d5db' : '#4a4949'   // 다크: 연회색, 라이트: 차콜
  const bioColor   = '#E8A428'                          // 항상 오렌지
  const tagColor   = isDark ? '#9ca3af' : '#222222'    // tagline 기본색
  const redColor   = '#cc1111'

  // SVG 원본 viewBox 비율 620:220 ≈ 2.818
  const width = Math.round(height * (620 / 220))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 220"
      width={width}
      height={height}
      fill="none"
      aria-label="ABL Bio"
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* abl */}
      <text
        x="0" y="168"
        fontFamily="'Arial Black','Arial',sans-serif"
        fontSize="155" fontWeight="900"
        fill={ablColor}
        letterSpacing="-4"
      >abl</text>

      {/* 수직 바 */}
      <rect x="306" y="22" width="19" height="152" rx="2" fill={bioColor} />

      {/* 원 (도트) */}
      <circle cx="315" cy="10" r="15" fill={bioColor} />

      {/* bio */}
      <text
        x="332" y="168"
        fontFamily="'Arial Black','Arial',sans-serif"
        fontSize="155" fontWeight="900"
        fill={bioColor}
        letterSpacing="-4"
      >bio</text>

      {/* tagline */}
      <text x="78"  y="205" fontFamily="Arial,sans-serif" fontSize="29" fill={tagColor}>medicine for </text>
      <text x="337" y="205" fontFamily="Arial,sans-serif" fontSize="29" fill={redColor}>a</text>
      <text x="356" y="205" fontFamily="Arial,sans-serif" fontSize="29" fill={tagColor}> better l</text>
      <text x="533" y="205" fontFamily="Arial,sans-serif" fontSize="29" fill={redColor}>i</text>
      <text x="546" y="205" fontFamily="Arial,sans-serif" fontSize="29" fill={tagColor}>fe</text>
    </svg>
  )
}
