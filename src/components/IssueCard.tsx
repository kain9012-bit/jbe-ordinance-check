import React from 'react';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { Badge } from './Ui';
import { LEVEL_TONE, type Group } from '../types';

/** 국가법령정보센터 주소에는 한글이 그대로 들어간다. 브라우저가 알아서 인코딩하지만 명시해 둔다. */
const href = (u: string) => encodeURI(u);

/**
 * 자치법규 한 건. 안에 어긋난 인용을 줄 단위로 늘어놓는다.
 *
 * 한 줄은 '지금 적힌 인용 → 바꿀 곳' 한 쌍이 중심이다. 그 아래 왜 어긋났는지와 근거 개정을 붙인다.
 * 읽는 사람이 판정을 믿고 넘어가지 않도록, 자치법규 원문과 현행 조문으로 바로 가는 링크를 같이 둔다.
 * 판정만 있고 확인할 길이 없으면 그대로 옮겨 적는 수밖에 없고, 그건 이 화면이 노리는 바가 아니다.
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
        <a
          href={href(group.items[0].ordUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 font-bold text-slate-600 hover:border-blue-600 hover:text-blue-700"
        >
          <FileText className="w-3 h-3" aria-hidden="true" />
          자치법규 원문
        </a>
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
          {x.links.length > 0 && (
            <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {x.links.map((l) => (
                <a
                  key={l.url}
                  href={href(l.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-blue-700 underline decoration-slate-300 underline-offset-2"
                >
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    ))}
  </article>
);
