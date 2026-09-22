import React from 'react';
import { Info, ScrollText } from 'lucide-react';
import { AS_OF } from '../types';

/**
 * 머리말은 두 줄이다.
 *
 * 위쪽 회색 띠 — 이 자료의 성격. 나머지 화면이 누리집과 같은 옷을 입고 있어
 * 공식 고시처럼 읽히기 쉬운데, 기계가 대조하고 사람이 훑어본 1차 자료다.
 * 아래쪽 — 서비스 이름. 게시판을 거치지 않고 주소로 바로 들어오는 화면이라
 * 무엇을 보는 곳인지 한 줄은 필요하다.
 */
export const Header: React.FC = () => (
  <header className="sticky top-0 z-30 bg-white jbe-noprint">
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-600">
        <span className="flex items-start gap-1.5 min-w-0">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="min-w-0">
            <strong className="font-bold text-slate-900">비공식</strong> 자체 점검 자료 · 소관부서
            확인 전 1차 판정
          </span>
        </span>
        <span className="shrink-0 tabular-nums">
          법령 {AS_OF.law} · 자치법규 {AS_OF.ordinance} 기준
        </span>
      </div>
    </div>
    <div className="border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
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
    </div>
  </header>
);
