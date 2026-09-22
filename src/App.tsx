import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowUp, Clock, FileSearch, Files, ListChecks, Search, SlidersHorizontal,
} from 'lucide-react';
import { Header } from './components/Header';
import { IssueCard } from './components/IssueCard';
import { MethodTab } from './components/MethodTab';
import { Chip, EmptyState, SectionTitle, Stat } from './components/Ui';
import { countOrdinances, groupByOrdinance } from './lib/group';
import { AS_OF, LEVELS, LEVEL_DESC, type Issue, type Level, type Tab } from './types';
import raw from './data/issues.json';

const DATA = raw as Issue[];

export default function App() {
  const [tab, setTab] = useState<Tab>('list');
  const [level, setLevel] = useState<Level | ''>('');
  const [dept, setDept] = useState('');
  const [q, setQ] = useState('');
  const [top, setTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const depts = useMemo(
    () => [...new Set(DATA.map((x) => x.dept))].sort((a, b) => a.localeCompare(b, 'ko')),
    [],
  );

  /** 구분 칩은 부서·검색을 먼저 적용한 결과의 건수를 보여준다. 눌러 보기 전에 몇 건인지 알 수 있다. */
  const base = useMemo(
    () =>
      DATA.filter(
        (x) =>
          (!dept || x.dept === dept) &&
          (!q || `${x.name}${x.cur}${x.fix}${x.issue}${x.loc}`.includes(q.trim())),
      ),
    [dept, q],
  );

  const shown = base.filter((x) => !level || x.level === level);

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-800 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      <a className="krds-skip" href="#container">
        본문 바로가기
      </a>
      <Header tab={tab} onTab={setTab} />

      {/* 첫 화면 띠 — 무엇을 점검했고 몇 건이 걸렸는지 */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="jbe-display text-3xl sm:text-[2.75rem] font-extrabold text-slate-900 leading-tight tracking-tight">
            상위법은 바뀌었는데 <span className="text-blue-700">아직 그대로인 자치법규</span>
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            교육청 누리집 자치법규 {AS_OF.total}건이 인용한 법령 조문을 현행 법령과 조 단위로
            대조한 결과. 조문 번호까지 본 1차 판정이라,{' '}
            <button
              type="button"
              onClick={() => setTab('method')}
              className="font-bold text-blue-700 underline underline-offset-2 hover:text-blue-800"
            >
              무엇을 보지 못하는지
            </button>
            도 같이 확인.
          </p>
          {tab === 'list' && (
            <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-5">
              <Stat
                icon={<Files className="w-3.5 h-3.5" aria-hidden="true" />}
                label="점검 대상"
                value={AS_OF.total}
                desc={AS_OF.breakdown}
              />
              <Stat
                icon={<ListChecks className="w-3.5 h-3.5" aria-hidden="true" />}
                label="대조한 인용 조문"
                value={AS_OF.checked.toLocaleString('ko-KR')}
                desc={`법령 인용 ${AS_OF.cites.toLocaleString('ko-KR')}건 중`}
              />
              <Stat
                icon={<AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />}
                label="정비 필요"
                value={countOrdinances(DATA, '정비 필요')}
                desc="현행 시행 법령과 불일치"
                tone="red"
              />
              <Stat
                icon={<Clock className="w-3.5 h-3.5" aria-hidden="true" />}
                label="시행 전 정비"
                value={countOrdinances(DATA, '시행 전 정비')}
                desc="공포됐고 시행일 전"
                tone="amber"
              />
              <Stat
                icon={<FileSearch className="w-3.5 h-3.5" aria-hidden="true" />}
                label="표기 정비"
                value={countOrdinances(DATA, '표기 정비')}
                desc="법령명 오기 · 옛 용어"
              />
            </div>
          )}
        </div>
      </div>

      <main id="container" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'method' ? (
          <MethodTab />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Chip on={level === ''} onClick={() => setLevel('')} count={countOrdinances(base)}>
                전체
              </Chip>
              {LEVELS.map((l) => (
                <Chip
                  key={l}
                  on={level === l}
                  onClick={() => setLevel(l)}
                  count={countOrdinances(base, l)}
                >
                  {l}
                </Chip>
              ))}
              <span className="flex-1" />
              <label className="flex items-center gap-1.5 text-sm text-slate-500">
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">소관부서</span>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-700 bg-white hover:border-blue-600 focus:border-blue-600"
                >
                  <option value="">소관부서 전체</option>
                  {depts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 flex-1 min-w-[12rem] max-w-sm rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white focus-within:border-blue-600">
                <Search className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span className="sr-only">검색</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="자치법규명 · 법령명 검색"
                  className="flex-1 min-w-0 text-sm outline-none"
                />
              </label>
            </div>

            {shown.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={<Search className="w-5 h-5" aria-hidden="true" />}
                  title="조건에 맞는 자치법규 없음"
                  desc="부서나 검색어를 바꿔 보세요."
                />
              </div>
            ) : (
              LEVELS.filter((l) => !level || l === level).map((l) => {
                const groups = groupByOrdinance(shown.filter((x) => x.level === l));
                if (!groups.length) return null;
                return (
                  <section key={l} className="mt-7">
                    <SectionTitle count={groups.length} desc={LEVEL_DESC[l]}>
                      {l}
                    </SectionTitle>
                    <div className="mt-2.5 space-y-3">
                      {groups.map((g) => (
                        <IssueCard key={`${g.name}|${g.level}`} group={g} />
                      ))}
                    </div>
                  </section>
                );
              })
            )}

            <p className="mt-10 border-t border-slate-200 pt-4 text-sm text-slate-500">
              조(條) 단위 대조 결과. 항·호 이동, 행정규칙 인용, 조문 내용 변화는 빠져 있음 ·{' '}
              <button
                type="button"
                onClick={() => setTab('method')}
                className="font-bold text-blue-700 underline underline-offset-2 hover:text-blue-800"
              >
                점검 방법과 한계 보기
              </button>
            </p>
          </>
        )}
      </main>

      <footer className="bg-slate-900 mt-auto jbe-noprint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-between gap-4 text-sm text-slate-300">
          <div>
            <b className="block text-white">자치법규 정합성 점검</b>
            전북특별자치도교육청 자치법규 · 상위법령 대조 결과
          </div>
          <div className="text-slate-400">
            출처 — 교육청 누리집 법무행정, 국가법령정보센터 원문 미러(legalize-kr)
          </div>
        </div>
      </footer>

      {top && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="맨 위로"
          className="fixed right-4 bottom-4 w-11 h-11 rounded-full border border-slate-300 bg-white text-slate-600 shadow-md hover:border-blue-600 hover:text-blue-700 flex items-center justify-center jbe-noprint"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
