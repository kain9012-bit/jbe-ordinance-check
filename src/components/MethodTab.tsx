import React from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, CircleSlash, Database, Eye } from 'lucide-react';
import { SectionTitle } from './Ui';
import { AS_OF } from '../types';

const Card: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ icon, title, desc, children }) => (
  <section className="bg-white rounded-lg border border-slate-200 p-5">
    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
      <span className="text-blue-600" aria-hidden="true">
        {icon}
      </span>
      {title}
    </h3>
    {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
    <div className="mt-3 text-[0.95rem] text-slate-700">{children}</div>
  </section>
);

const Ul: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-300">{children}</ul>
);

/**
 * 점검 방법과 한계.
 *
 * 목록 탭 아래 각주로 달아 두면 아무도 읽지 않는다. 이 자료는 "조례가 틀렸다"는 말로
 * 읽히기 쉬운데, 실제로는 조문 번호 대조까지만 한 1차 결과다. 무엇을 보지 못하는지가
 * 무엇을 찾았는지만큼 중요하므로 탭을 따로 뒀다.
 */
export const MethodTab: React.FC = () => (
  <div className="space-y-6">
    <div>
      <SectionTitle desc="읽기 전에 알아야 할 것">이 화면의 성격</SectionTitle>
      <p className="mt-2 max-w-4xl text-slate-700">
        자치법규가 인용한 <b>법령 조문 번호</b>가 현행 법령과 맞는지 대조한 결과. 법제 검토가
        아니라 기계 대조에 사람 확인을 더한 1차 자료. 개정 여부와 방법은 소관부서 판단.
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card icon={<CheckCircle2 className="w-4.5 h-4.5" />} title="보여주는 것">
        <Ul>
          <li>어느 부서의 어느 자치법규 몇 조를 고쳐야 하는지</li>
          <li>지금 적힌 인용과 바꿔 넣을 인용. 개정안 작성에 바로 쓰는 형태</li>
          <li>근거가 된 상위법 개정의 공포일·시행일. 시급한 것과 아닌 것의 구분</li>
          <li>아직 시행 전인 개정까지 포함. 시행일 전에 미리 정비 가능</li>
          <li>자치법규 원문과 현행 조문 링크. 판정을 그대로 믿지 않고 직접 확인</li>
        </Ul>
      </Card>

      <Card icon={<BookOpen className="w-4.5 h-4.5" />} title="판정 구분">
        <Ul>
          <li>
            <b>정비 필요</b> — 인용 조문이 삭제·이동했거나 법령 제명이 바뀐 경우. 현재 시행 중인
            법령 기준
          </li>
          <li>
            <b>시행 전 정비</b> — 개정이 공포됐고 시행일은 아직인 경우. 시행일까지 정비하면 됨
          </li>
          <li>
            <b>표기 정비</b> — 법령명 오타·누락, 상위법에서 바뀐 용어. 효력 문제는 아니지만 인용이
            정확하지 않음
          </li>
        </Ul>
      </Card>
    </div>

    <Card
      icon={<Database className="w-4.5 h-4.5" />}
      title="점검 방법"
      desc={`자치법규 ${AS_OF.total}건 · 법령 인용 ${AS_OF.cites.toLocaleString('ko-KR')}건에서 출발`}
    >
      <ol className="list-decimal pl-5 space-y-1.5 marker:text-slate-400 marker:font-bold">
        <li>
          <b>대상 확정</b> — 교육청 누리집 법무행정 목록 {AS_OF.total}건(조례·규칙·훈령). 전문
          미러와 이름·공포일 전건 대조해 일치 확인
        </li>
        <li>
          <b>인용 추출</b> — 본문에서 「법령명」 제○조를 뽑고, <code>같은 법</code>,{' '}
          <code>이하 “법”이라 한다</code> 같은 약칭을 풀어 원래 법령으로 되돌림. 부칙은 제외
        </li>
        <li>
          <b>시점 대조</b> — 자치법규가 제정·개정된 시점의 법령 조문과 현행 조문을 비교. 개정
          한 번이 커밋 하나인 법령 저장소를 써서 그 시점의 조문을 그대로 꺼냄
        </li>
        <li>
          <b>사람 판정</b> — 자동으로 걸린 후보 {AS_OF.reviewed}건을 문맥과 함께 한 건씩 확인.
          조문 제목만 바뀐 경우와 조문이 실제로 이동한 경우를 갈라냄
        </li>
      </ol>
    </Card>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card
        icon={<CircleSlash className="w-4.5 h-4.5" />}
        title="대조하지 않은 것"
        desc="찾지 못한 게 아니라 범위 밖"
      >
        <Ul>
          <li>
            <b>항·호 이동</b> — 조(條)까지만 대조. 제○조제2항이 제3항으로 밀린 경우는 안 잡힘
          </li>
          <li>
            <b>행정규칙 인용</b> — 고시·훈령·예규 10여 종. 조문 원문 저장소에 없어 대조 자체가 불가
          </li>
          <li>
            <b>조문 번호 없는 인용 {AS_OF.nameOnly}건</b> — 법령명만 든 경우. 제명 변경만 확인
          </li>
          <li>
            <b>별표·서식</b> — 본문만 봄. 별표 안의 인용은 빠짐
          </li>
        </Ul>
      </Card>

      <Card
        icon={<AlertTriangle className="w-4.5 h-4.5" />}
        title="이 방식으로는 볼 수 없는 것"
        desc="조문 번호를 보는 방법의 한계"
      >
        <Ul>
          <li>
            <b>내용 변화</b> — 조문 번호와 제목이 그대로면 통과. 같은 조 안에서 요건·대상·금액이
            바뀐 경우는 대부분 못 잡음
          </li>
          <li>
            <b>위임 미이행</b> — 상위법이 새로 조례에 위임했는데 아직 만들지 않은 경우. 인용을 보는
            방식으로는 원리상 보이지 않음. 별도 점검이 필요한 영역
          </li>
          <li>
            <b>자치법규 상호 정합성</b> — 조례와 그 시행규칙 사이 조문 대조는 하지 않음. 제명
            불일치만 확인
          </li>
          <li>
            <b>효력 판단</b> — 인용이 어긋났다고 그 조문이 무효인지는 판단하지 않음
          </li>
        </Ul>
      </Card>
    </div>

    <Card icon={<Eye className="w-4.5 h-4.5" />} title="자료 시점과 출처">
      <Ul>
        <li>
          기준일 — 현행 법령 {AS_OF.law} 자치법규 {AS_OF.ordinance} 그 뒤 개정은 반영되지 않음
        </li>
        <li>
          자치법규 목록 —{' '}
          <a
            className="font-bold text-blue-700 underline underline-offset-2"
            href="https://www.jbe.go.kr/law/index.jbe?menuCd=DOM_000000901001000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            전북특별자치도교육청 법무행정
          </a>
          . 소관부서는 국가법령정보 자치법규 정보 기준
        </li>
        <li>
          조문 원문 — 국가법령정보센터 원문을 개정 단위로 보관한 미러{' '}
          <a
            className="font-bold text-blue-700 underline underline-offset-2"
            href="https://github.com/legalize-kr/legalize-kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            legalize-kr
          </a>
          {' · '}
          <a
            className="font-bold text-blue-700 underline underline-offset-2"
            href="https://github.com/legalize-kr/ordinance-kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ordinance-kr
          </a>
        </li>
        <li>각 건의 링크는 국가법령정보센터 해당 조문으로 바로 연결됨</li>
      </Ul>
    </Card>
  </div>
);
