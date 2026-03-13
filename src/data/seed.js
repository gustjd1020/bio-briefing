// ─────────────────────────────────────────────
// 실제 논문/기사 시드 데이터 (localStorage 초기화용)
// ─────────────────────────────────────────────

export const seedTopicGroups = [
  { id: 1, title: 'Mirvetuximab 난소암 FDA 승인 관련' },
  { id: 2, title: 'Olaparib 임상 관련' },
  { id: 3, title: 'AI 신약 개발 관련' },
]

export const seedKeywords = [
  { id: 1,  name: '난소암',         priority: 1,  color: '#e74c3c' },
  { id: 2,  name: '항체치료',       priority: 2,  color: '#e67e22' },
  { id: 3,  name: 'AI신약',         priority: 3,  color: '#3498db' },
  { id: 4,  name: 'CLDN6',          priority: 4,  color: '#2ecc71' },
  { id: 5,  name: 'Napi2b',         priority: 5,  color: '#9b59b6' },
  { id: 6,  name: '임상시험',       priority: 6,  color: '#1abc9c' },
  { id: 7,  name: '면역항암',       priority: 7,  color: '#f39c12' },
  { id: 8,  name: 'FOLR1',          priority: 8,  color: '#e91e63' },
  { id: 9,  name: 'CDH6',           priority: 9,  color: '#00bcd4' },
  { id: 10, name: '폐암',           priority: 10, color: '#ff5722' },
  { id: 11, name: '대장암',         priority: 11, color: '#795548' },
  { id: 12, name: '공모주',         priority: 12, color: '#607d8b' },
  { id: 13, name: 'T cell engager',          priority: 13, color: '#ff9800' },
  { id: 14, name: 'CD3',                     priority: 14, color: '#673ab7' },
  { id: 15, name: '4-1BB',                   priority: 15, color: '#009688' },
  { id: 16, name: 'ADC',                     priority: 16, color: '#c0392b' },
  { id: 17, name: 'Antibody drug conjugates', priority: 17, color: '#8e44ad' },
]

export const seedNews = [
  {
    id: 1,
    title: 'FDA Grants Accelerated Approval to Mirvetuximab Soravtansine-gynx (ELAHERE) for FRα-Positive Platinum-Resistant Ovarian Cancer',
    summary:
      'FDA가 FRα 과발현 백금 저항성 상피성 난소암 성인 환자 치료에 ImmunoGen의 항체-약물 접합체(ADC) mirvetuximab soravtansine(ELAHERE)을 정식 승인했다. 이는 FRα를 표적으로 한 최초의 FDA 승인 치료제다. SORAYA 단일군 임상에서 ORR 31.7%, 중앙 반응 지속기간 6.9개월을 기록했다.',
    url: 'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-mirvetuximab-soravtansine-gynx-fra-positive-platinum-resistant',
    source_name: 'FDA',
    published_at: '2022-11-14',
    topic_group_id: 1,
    week_label: '2022-W46',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
    url_status: 'verified',
  },
  {
    id: 2,
    title: 'Mirvetuximab Soravtansine in FRα-Positive, Platinum-Resistant Ovarian Cancer (MIRASOL)',
    summary:
      'MIRASOL Phase 3 무작위 대조 임상에서 mirvetuximab soravtansine이 백금 저항성 고위험 난소암 환자에서 무진행생존기간(PFS) 중앙값 5.62개월 vs. 화학요법 3.98개월(HR 0.65, p<0.001), 전체생존기간(OS) 중앙값 16.46개월 vs. 12.75개월(HR 0.67, p=0.0046)로 통계적으로 유의미한 개선을 보였다.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2309169',
    source_name: 'NEJM',
    published_at: '2023-08-27',
    topic_group_id: 1,
    week_label: '2023-W35',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
    url_status: 'verified',
  },
  {
    id: 3,
    title: 'Olaparib for Metastatic Breast Cancer in Patients with a Germline BRCA Mutation (OlympiAD)',
    summary:
      'OlympiAD Phase 3 임상에서 생식세포 BRCA 변이 HER2 음성 전이성 유방암 환자에서 olaparib 단독요법이 의사 선택 화학요법 대비 PFS 중앙값 7.0개월 vs. 4.2개월(HR 0.58, p<0.001)로 유의미한 개선을 보였다. ORR은 59.9% vs. 28.8%였다. PARP 억제제의 유방암 적응증 확장 근거가 된 핵심 임상이다.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1706450',
    source_name: 'NEJM',
    published_at: '2017-08-10',
    topic_group_id: 2,
    week_label: '2017-W32',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
    url_status: 'verified',
  },
  {
    id: 4,
    title: 'Highly accurate protein structure prediction with AlphaFold',
    summary:
      'DeepMind이 CASP14에서 발표한 AlphaFold2는 단백질 구조 예측의 정확도를 실험적 방법에 근접한 수준으로 끌어올렸다. 100개 이상의 도메인 중 2/3에서 원자 정확도 수준의 예측을 달성했으며, GDT 점수 92.4를 기록했다. 구조 생물학과 신약 개발 패러다임을 바꾼 획기적인 성과다.',
    url: 'https://www.nature.com/articles/s41586-021-03819-2',
    source_name: 'Nature',
    published_at: '2021-07-15',
    topic_group_id: 3,
    week_label: '2021-W28',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
    url_status: 'verified',
  },
  {
    id: 5,
    title: 'A foundation model for generalizable disease detection from retinal images (RETFound)',
    summary:
      'UCL 연구팀이 개발한 안저 이미지 기반 파운데이션 모델 RETFound는 라벨 없는 157만 장 망막 이미지로 자기지도학습(SSL) 사전훈련 후 당뇨병성 망막병증·녹내장·AMD 등 다양한 안과 질환 탐지에서 기존 지도학습 모델을 능가했다. 의료 AI 파운데이션 모델의 실용화 가능성을 입증한 대표 연구다.',
    url: 'https://www.nature.com/articles/s41586-023-06555-x',
    source_name: 'Nature',
    published_at: '2023-08-28',
    topic_group_id: 3,
    week_label: '2023-W35',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
    url_status: 'verified',
  },
]

export const seedNewsKeywords = [
  // 뉴스 1 (FDA ELAHERE) — 난소암, 항체치료, 임상시험, FOLR1, ADC, Antibody drug conjugates
  { news_id: 1, keyword_id: 1 },
  { news_id: 1, keyword_id: 2 },
  { news_id: 1, keyword_id: 6 },
  { news_id: 1, keyword_id: 8 },
  { news_id: 1, keyword_id: 16 },
  { news_id: 1, keyword_id: 17 },
  // 뉴스 2 (MIRASOL NEJM) — 난소암, 항체치료, 임상시험, FOLR1, ADC, Antibody drug conjugates
  { news_id: 2, keyword_id: 1 },
  { news_id: 2, keyword_id: 2 },
  { news_id: 2, keyword_id: 6 },
  { news_id: 2, keyword_id: 8 },
  { news_id: 2, keyword_id: 16 },
  { news_id: 2, keyword_id: 17 },
  // 뉴스 3 (OlympiAD NEJM) — 난소암, 임상시험
  { news_id: 3, keyword_id: 1 },
  { news_id: 3, keyword_id: 6 },
  // 뉴스 4 (AlphaFold Nature) — AI신약
  { news_id: 4, keyword_id: 3 },
  // 뉴스 5 (RETFound Nature) — AI신약
  { news_id: 5, keyword_id: 3 },
]

// ── 스마트 초기화 ────────────────────────────────────────────────────────
// 뉴스·뉴스키워드 : 데이터가 없을 때만 시드 (사용자 추가 데이터 보호)
// 키워드·토픽그룹 : 항상 최신 버전으로 덮어씀 (새 키워드 추가 즉시 반영)
export const initDB = () => {
  // 키워드·토픽그룹은 항상 최신 시드로 유지
  localStorage.setItem('keywords', JSON.stringify(seedKeywords))
  localStorage.setItem('topicGroups', JSON.stringify(seedTopicGroups))

  // 뉴스·뉴스키워드는 최초 1회만 (기존 데이터 있으면 건너뜀)
  if (!localStorage.getItem('news')) {
    localStorage.setItem('news', JSON.stringify(seedNews))
    localStorage.setItem('newsKeywords', JSON.stringify(seedNewsKeywords))
  }
}

// ── 강제 리셋 (개발/디버그용) ────────────────────────────────────────────
// 필요할 때만 직접 호출
export const resetDB = () => {
  localStorage.setItem('news', JSON.stringify(seedNews))
  localStorage.setItem('keywords', JSON.stringify(seedKeywords))
  localStorage.setItem('newsKeywords', JSON.stringify(seedNewsKeywords))
  localStorage.setItem('topicGroups', JSON.stringify(seedTopicGroups))
}
