import type { Group, Issue, Level } from '../types';

/** 자치법규명으로 묶는다. 한 자치법규가 여러 구분에 걸치면 구분별로 따로 묶인다. */
export function groupByOrdinance(list: Issue[]): Group[] {
  const map = new Map<string, Group>();
  for (const x of list) {
    const key = `${x.name}|${x.level}`;
    let g = map.get(key);
    if (!g) {
      g = { name: x.name, kind: x.kind, dept: x.dept, date: x.date, level: x.level, items: [] };
      map.set(key, g);
    }
    g.items.push(x);
  }
  return [...map.values()].sort(
    (a, b) => a.dept.localeCompare(b.dept, 'ko') || a.name.localeCompare(b.name, 'ko'),
  );
}

/** 구분별 자치법규 수. 줄 수가 아니라 자치법규 수를 센다 — 부서가 받는 일감의 단위다. */
export function countOrdinances(list: Issue[], level?: Level): number {
  return new Set(list.filter((x) => !level || x.level === level).map((x) => x.name)).size;
}
