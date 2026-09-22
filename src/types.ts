/** 판정 한 줄. analysis/data.py 가 만드는 src/data/issues.json 의 항목과 같은 모양이다. */
export type Issue = {
  /** 자치법규명 */
  name: string;
  /** 조례 · 규칙 · 훈령 */
  kind: string;
  /** 소관부서 */
  dept: string;
  /** 최종 공포일 */
  date: string;
  /** 판정 구분 */
  level: Level;
  /** 문제가 있는 자치법규의 조 위치 */
  loc: string;
  /** 지금 적혀 있는 인용 */
  cur: string;
  /** 무엇이 어긋났는지 */
  issue: string;
  /** 현행 기준으로 바꿀 곳 */
  fix: string;
  /** 근거가 된 상위법 개정 */
  basis: string;
};

export type Level = '정비 필요' | '시행 전 정비' | '표기 정비';

export const LEVELS: Level[] = ['정비 필요', '시행 전 정비', '표기 정비'];

export const LEVEL_DESC: Record<Level, string> = {
  '정비 필요': '현재 시행 중인 법령과 맞지 않는 인용',
  '시행 전 정비': '이미 공포된 개정. 시행일 전 정비 대상',
  '표기 정비': '법령명 오기와 상위법에서 바뀐 용어',
};

export const LEVEL_TONE: Record<Level, 'red' | 'amber' | 'slate'> = {
  '정비 필요': 'red',
  '시행 전 정비': 'amber',
  '표기 정비': 'slate',
};

/** 자치법규 하나로 묶은 판정 */
export type Group = {
  name: string;
  kind: string;
  dept: string;
  date: string;
  level: Level;
  items: Issue[];
};

/** 자료 시점. 수집을 다시 돌리면 이 값도 같이 고친다. */
export const AS_OF = {
  /** 현행 법령 미러 기준일 */
  law: '2026.9.21.',
  /** 자치법규 미러 기준일 */
  ordinance: '2026.9.18.',
  /** 점검 대상 건수 */
  total: 355,
  /** 종류별 건수 */
  breakdown: '조례 253 · 규칙 74 · 훈령 28',
  /** 대조한 인용 조문 수 */
  checked: 1579,
  /** 추출한 법령 인용 수 */
  cites: 2009,
  /** 사람이 문맥을 보고 판정한 후보 수 */
  reviewed: 131,
};
