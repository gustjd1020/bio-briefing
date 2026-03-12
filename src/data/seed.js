// ─────────────────────────────────────────────
// 더미 데이터 시드 (localStorage 최초 초기화용)
// ─────────────────────────────────────────────

export const seedTopicGroups = [
  { id: 1, title: 'Mirvetuximab 난소암 FDA 승인 관련' },
  { id: 2, title: 'Olaparib 병용요법 임상 관련' },
  { id: 3, title: 'CRISPR 유전자 편집 치료 관련' },
  { id: 4, title: 'AlphaFold3 단백질 구조 관련' },
  { id: 5, title: 'LLM 신약 개발 적용 관련' },
]

export const seedKeywords = [
  { id: 1, name: '난소암', priority: 1, color: '#e74c3c' },
  { id: 2, name: '항체치료', priority: 2, color: '#e67e22' },
  { id: 3, name: 'AI신약', priority: 3, color: '#3498db' },
  { id: 4, name: 'CRISPR', priority: 4, color: '#2ecc71' },
  { id: 5, name: 'LLM', priority: 5, color: '#9b59b6' },
  { id: 6, name: '임상시험', priority: 6, color: '#1abc9c' },
  { id: 7, name: '면역항암', priority: 7, color: '#f39c12' },
]

export const seedNews = [
  {
    id: 1,
    title: 'FDA, Mirvetuximab Soravtansine 재발성 난소암 1차 승인',
    summary:
      'ImmunoGen의 항체-약물 접합체(ADC) Mirvetuximab soravtansine(ELAHERE)이 FRα 과발현 백금 저항성 상피성 난소암 치료에 FDA 정식 승인을 받았다. MIRASOL Phase 3 임상에서 무진행생존기간(PFS) 중앙값 5.6개월 vs. 화학요법 3.8개월로 유의미한 개선을 보였다.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2309169',
    source_name: 'NEJM',
    published_at: '2026-03-10',
    topic_group_id: 1,
    week_label: '2026-W11',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 2,
    title: 'Mirvetuximab, MIRASOL 연구 최종 OS 데이터 발표 — ASCO GU 2026',
    summary:
      'MIRASOL 임상의 최종 전체생존기간(OS) 업데이트가 ASCO GU 2026에서 공개됐다. OS 중앙값 16.5개월(mirvetuximab) vs. 12.7개월(화학요법)로, FRα 고발현 환자군에서 특히 뚜렷한 혜택이 확인됐다.',
    url: 'https://ascopubs.org/doi/10.1200/JCO.2026.01.001',
    source_name: 'ASCO',
    published_at: '2026-03-09',
    topic_group_id: 1,
    week_label: '2026-W11',
    is_featured: true,
    is_bookmarked: true,
    notes: '팀 리뷰 예정 — 3월 넷째 주 저널클럽',
  },
  {
    id: 3,
    title: 'Olaparib + Bevacizumab 병용, BRCA 변이 난소암 PFS 개선 확인',
    summary:
      'PAOLA-1 임상 추적 분석에서 Olaparib(린파자) + Bevacizumab 병용 유지요법이 BRCA1/2 변이 고위험 1기 난소암 환자의 5년 PFS를 대조군 대비 유의미하게 향상시켰다. HRD 양성 환자에서 효과 극대화.',
    url: 'https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(26)00012-3/fulltext',
    source_name: 'Lancet Oncology',
    published_at: '2026-03-08',
    topic_group_id: 2,
    week_label: '2026-W11',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 4,
    title: 'Olaparib 내성 기전 새롭게 규명 — RAD51 복원이 핵심',
    summary:
      'Nature Medicine 연구팀이 Olaparib 내성 기전으로 RAD51 매개 상동재조합(HR) 복원을 지목했다. PARP 억제제 내성 극복을 위한 ATR 억제제 병용 전략이 전임상에서 유효성을 보였다.',
    url: 'https://www.nature.com/articles/s41591-026-00123-5',
    source_name: 'Nature Medicine',
    published_at: '2026-03-07',
    topic_group_id: 2,
    week_label: '2026-W11',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 5,
    title: 'CRISPR-Cas9 겸상적혈구병 치료제 Casgevy, 유럽 첫 환자 투여 성공',
    summary:
      'Vertex·CRISPR Therapeutics의 Casgevy(exa-cel)가 유럽에서 첫 환자에게 성공적으로 투여됐다. 12개월 추적에서 수혈 의존도 94% 감소, 혈관폐색 위기 사건 0건을 기록했다.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMe2600001',
    source_name: 'NEJM',
    published_at: '2026-03-06',
    topic_group_id: 3,
    week_label: '2026-W11',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 6,
    title: '차세대 CRISPR 염기편집으로 희귀 유전성 시각장애 교정 성공 — Stanford',
    summary:
      'Stanford 연구팀이 Prime Editing을 이용해 레버 선천성 흑내장(LCA) 원인 CEP290 변이를 망막 오가노이드에서 99% 효율로 교정했다. 오프타겟 편집은 전장 유전체 분석에서 통계적 유의 수준 이하.',
    url: 'https://www.science.org/doi/10.1126/science.adx1234',
    source_name: 'Science',
    published_at: '2026-03-05',
    topic_group_id: 3,
    week_label: '2026-W11',
    is_featured: false,
    is_bookmarked: true,
    notes: 'Stanford 연구 — 그룹장님 공유 요청',
  },
  {
    id: 7,
    title: 'AlphaFold3, 단백질-소분자 복합체 예측 정확도 PDB 기준 RMSD 0.8Å 달성',
    summary:
      'DeepMind AlphaFold3가 단백질-소분자 결합 구조 예측에서 결정학 분해능 수준인 RMSD 0.8Å를 달성했다는 벤치마크 결과가 공개됐다. 특히 키나아제 표적 신약 설계에 활용도가 높다는 평가.',
    url: 'https://www.nature.com/articles/s41586-026-00234-7',
    source_name: 'Nature',
    published_at: '2026-03-04',
    topic_group_id: 4,
    week_label: '2026-W10',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 8,
    title: 'AlphaFold3 + Molecular Dynamics 통합 파이프라인 오픈소스 공개',
    summary:
      'EMBL-EBI 팀이 AlphaFold3 구조 예측과 분자동역학(MD) 시뮬레이션을 자동으로 연결하는 오픈소스 파이프라인 AF3-MD를 GitHub에 공개했다. 단백질 안정성 평가 시간이 기존 대비 40% 단축.',
    url: 'https://github.com/embl-ebi/af3-md',
    source_name: 'GitHub/EMBL-EBI',
    published_at: '2026-03-03',
    topic_group_id: 4,
    week_label: '2026-W10',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 9,
    title: 'Claude 3.7 Sonnet, 분자 설계 벤치마크 ADMET 예측 SOTA 달성',
    summary:
      'Anthropic의 Claude 3.7 Sonnet이 신약 후보 화합물의 흡수·분포·대사·배설·독성(ADMET) 예측 벤치마크에서 기존 전문 모델을 앞서는 성능을 보였다. 자연어 기반 분자 설계 지시에서도 유효성 증가.',
    url: 'https://www.biorxiv.org/content/10.1101/2026.03.01.000001v1',
    source_name: 'bioRxiv',
    published_at: '2026-03-02',
    topic_group_id: 5,
    week_label: '2026-W10',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 10,
    title: 'GPT-5 기반 임상시험 프로토콜 자동 생성 시스템, FDA 파일럿 참여',
    summary:
      'OpenAI와 FDA가 GPT-5를 활용한 임상시험 프로토콜 초안 자동 생성 파일럿 프로그램을 시작했다. 규정 적합성 검토 시간이 평균 60% 단축됐으며 Phase 2 신청 부문에서 시범 적용 예정.',
    url: 'https://www.statnews.com/2026/03/01/fda-gpt5-clinical-trial-protocol/',
    source_name: 'STAT News',
    published_at: '2026-03-01',
    topic_group_id: 5,
    week_label: '2026-W10',
    is_featured: false,
    is_bookmarked: false,
    notes: '',
  },
  {
    id: 11,
    title: 'PD-1/PD-L1 이중 특이성 항체 IBI389, 위암 1차 치료 Phase 3 진입',
    summary:
      'Innovent Biologics의 PD-1·CTLA-4 이중 특이성 항체 IBI389가 위암 1차 치료 Phase 3 임상에 진입했다. 선행 Phase 1b/2에서 ORR 52%, mOS 14.3개월로 기존 단일 면역관문 억제제 대비 우월한 성적.',
    url: 'https://clinicaltrials.gov/ct2/show/NCT0599XXXX',
    source_name: 'ClinicalTrials.gov',
    published_at: '2026-03-11',
    topic_group_id: null,
    week_label: '2026-W11',
    is_featured: true,
    is_bookmarked: false,
    notes: '',
  },
]

export const seedNewsKeywords = [
  // 뉴스 1 — 난소암, 항체치료, 임상시험
  { news_id: 1, keyword_id: 1 },
  { news_id: 1, keyword_id: 2 },
  { news_id: 1, keyword_id: 6 },
  // 뉴스 2 — 난소암, 항체치료, 임상시험
  { news_id: 2, keyword_id: 1 },
  { news_id: 2, keyword_id: 2 },
  { news_id: 2, keyword_id: 6 },
  // 뉴스 3 — 난소암, 임상시험
  { news_id: 3, keyword_id: 1 },
  { news_id: 3, keyword_id: 6 },
  // 뉴스 4 — 난소암, AI신약
  { news_id: 4, keyword_id: 1 },
  { news_id: 4, keyword_id: 3 },
  // 뉴스 5 — CRISPR, 임상시험
  { news_id: 5, keyword_id: 4 },
  { news_id: 5, keyword_id: 6 },
  // 뉴스 6 — CRISPR
  { news_id: 6, keyword_id: 4 },
  // 뉴스 7 — AI신약
  { news_id: 7, keyword_id: 3 },
  // 뉴스 8 — AI신약
  { news_id: 8, keyword_id: 3 },
  // 뉴스 9 — AI신약, LLM
  { news_id: 9, keyword_id: 3 },
  { news_id: 9, keyword_id: 5 },
  // 뉴스 10 — LLM, 임상시험
  { news_id: 10, keyword_id: 5 },
  { news_id: 10, keyword_id: 6 },
  // 뉴스 11 — 면역항암, 임상시험, 항체치료
  { news_id: 11, keyword_id: 7 },
  { news_id: 11, keyword_id: 6 },
  { news_id: 11, keyword_id: 2 },
]

export const initDB = () => {
  if (!localStorage.getItem('news')) {
    localStorage.setItem('news', JSON.stringify(seedNews))
  }
  if (!localStorage.getItem('keywords')) {
    localStorage.setItem('keywords', JSON.stringify(seedKeywords))
  }
  if (!localStorage.getItem('newsKeywords')) {
    localStorage.setItem('newsKeywords', JSON.stringify(seedNewsKeywords))
  }
  if (!localStorage.getItem('topicGroups')) {
    localStorage.setItem('topicGroups', JSON.stringify(seedTopicGroups))
  }
}
