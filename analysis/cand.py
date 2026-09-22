import json,re,difflib,collections,sys
sys.path.insert(0,'w')
S='/tmp/claude-0/-home-claude/a26b1545-a4bb-52f0-9283-a44904f9e2bc/scratchpad/'
exec(open(S+'w/judge.py').read().split('res=[]')[0])
NS=lambda s:re.sub(r'\s','',s)
groups=collections.OrderedDict()
for c in cites:
    ps=[p for p in c['paths'] if p!='ORD']
    if not ps or not c['arts']: continue
    p=pick(ps,c['law']); H=head(p); tnow,sh,anow=parse(H[1],p)
    for a in c['arts']:
        cur=anow.get(a)
        refs=sorted({d for d in [c['enact'],c['ptag']] if d})
        olds=[]
        for d in refs:
            V=version_at(p,d)
            if V: olds.append((d,V[0],parse(V[1],p)[2].get(a)))
        reason=[]
        if cur is None: reason.append('현행 조문 없음')
        elif deleted(*cur): reason.append('현행 조문 삭제')
        for d,vd,o in olds:
            if o and cur and o[0]!=cur[0] and difflib.SequenceMatcher(None,NS(o[0]),NS(cur[0])).ratio()<0.8: reason.append(f'제목변경@{d}')
        w=term(c,c['law'])
        if w and cur and NS(w) not in NS(cur[0]+cur[1]) and any(o and NS(w) in NS(o[0]+o[1]) for _,_,o in olds): reason.append('용어소멸')
        if not reason: continue
        k=(c['ord'],c['law'],a)
        g=groups.setdefault(k,dict(ord=c['ord'],kind=c['kind'],dept=c['dept'],law=c['law'],lawnow=tnow,a=a,now=cur,olds=[(d,vd,o[0] if o else None) for d,vd,o in olds],ctx=[],reason=set(),term=w,path=p,siheng=sh))
        g['ctx'].append(c['ctx']); g['reason'].update(reason)
        # 이동 후보: 현행 법령에서 용어 포함 조문
        if w:
            g['moved']=[f"{k2}({v[0]})" for k2,v in anow.items() if NS(w) in NS(v[0])][:4] or [f"{k2}({v[0]})" for k2,v in anow.items() if NS(w) in NS(v[1])][:4]
        # 옛 조문 제목으로 이동 후보
        ot=[o[0] for _,_,o in olds if o and o[0]]
        if ot: g['moved_t']=[f"{k2}({v[0]})" for k2,v in anow.items() if v[0] and difflib.SequenceMatcher(None,NS(v[0]),NS(ot[-1])).ratio()>0.7][:3]
out=[]
for g in groups.values():
    g['reason']=sorted(g['reason']); g['now']=(g['now'][0],g['now'][1][:300]) if g['now'] else None; out.append(g)
json.dump(out,open(S+'w/cand.json','w'),ensure_ascii=False,indent=0)
print(len(out))
