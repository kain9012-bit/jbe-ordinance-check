import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Badge } from './Ui';
import { LEVEL_TONE, type Group } from '../types';

/**
 * 자치법규 한 건. 안에 어긋난 인용을 줄 단위로 늘어놓는다.
 *
 * 한 줄은 '지금 적힌 인용 → 바꿀 곳' 한 쌍이 중심이다. 왜 어긋났는지와 근거 개정은
 * 그 아래 작은 글씨로 붙인다. 부서가 표를 보고 바로 개정안을 쓰는 것이 목적이라,
 * 판정 문구보다 고칠 문자열이 먼저 보여야 한다.
 */
export const IssueCard: React.FC<{ group: Group }> = ({ group }) => (
  <article className="jbe-card bg-white rounded-lg border border-slate-200 overflow-hidden">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 border-b border-slate-100">
      <h3 className="flex-1 min-w-[16rem] text-base font-bold text-slate-900">{group.name}</h3>
      <span className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Badge tone={LEVEL_TONE[group.level]}>{group.level}</Badge>
        <span>{group.kind}</span>
        <Badge tone="blue">{group.dept}</Badge>
        <span className="tabular-nums">최종 공포 {group.date}</span>
      </span>
    </div>
    {group.items.map((x, i) => (
      <div
        key={i}
        className="grid gap-x-4 gap-y-1 px-4 py-3 border-t border-slate-100 first:border-t-0 sm:grid-cols-[8rem_1fr]"
      >
        <div className="text-sm font-bold text-slate-600">{x.loc}</div>
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
            <span className="text-slate-500 line-through decoration-red-500/70 decoration-2">
              {x.cur}
            </span>
            <ArrowRight
              className="w-4 h-4 shrink-0 text-slate-400 mt-1 rotate-90 sm:rotate-0"
              aria-label="바꿀 곳"
            />
            <span className="font-bold text-blue-700">{x.fix}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {x.issue}
            <span className="ml-1.5 whitespace-nowrap text-slate-400">· {x.basis}</span>
          </p>
        </div>
      </div>
    ))}
  </article>
);
