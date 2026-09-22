import React from 'react';
import { Info, ScrollText } from 'lucide-react';
import { AS_OF, TAB_LABEL, type Tab } from '../types';

const TABS: Tab[] = ['list', 'method'];

/**
 * 머리말 — 안내 띠, 서비스 이름, 탭 세 줄.
 *
 * 탭이 둘뿐이라 없애고 한 화면에 이어 붙일까 했는데, 그러면 '점검 방법과 한계'가
 * 목록 끝의 각주가 되어 아무도 안 읽는다. 이 자료는 "조례가 틀렸다"는 말로 읽히기 쉬워서
 * 무엇을 보지 못하는지를 같은 높이에 둬야 한다. 그래서 탭으로 올렸다.
 */
export const Header: React.FC<{ tab: Tab; onTab: (t: Tab) => void }> = ({ tab, onTab }) => (
  <header className="sticky top-0 z-30 bg-white jbe-noprint">
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-600">
        <span className="flex items-start gap-1.5 min-w-0">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="min-w-0">
            <strong className="font-bold text-slate-900">비공식</strong> 자체 점검 자료 · 조문 번호
            대조까지만 한 1차 판정
          </span>
        </span>
        <span className="shrink-0 tabular-nums">
          법령 {AS_OF.law} · 자치법규 {AS_OF.ordinance} 기준
        </span>
      </div>
    </div>
    <div className="border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-8 gap-y-2">
        <div className="flex items-center gap-3 py-3">
          <span className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ScrollText className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <strong className="jbe-display block text-lg font-extrabold text-slate-900 leading-tight">
              자치법규 정합성 점검
            </strong>
            <span className="block text-xs text-slate-500">전북특별자치도교육청</span>
          </span>
        </div>
        <ul role="tablist" className="flex items-center gap-6 sm:ml-auto">
          {TABS.map((t) => (
            <li key={t} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => onTab(t)}
                className={`py-4 text-base font-bold border-b-[3px] transition-colors ${
                  tab === t
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {TAB_LABEL[t]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </header>
);
