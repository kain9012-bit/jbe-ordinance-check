import json,re,subprocess,difflib,functools,os,collections
S='/tmp/claude-0/-home-claude/a26b1545-a4bb-52f0-9283-a44904f9e2bc/scratchpad/'
env=dict(os.environ,GIT_NO_LAZY_FETCH='1')
ix=json.load(open(S+'w/lkindex.json')); cites=json.load(open(S+'w/cites.json'))
@functools.lru_cache(None)
def blob(h,p):
    return subprocess.run(['git','-C',S+'lk','show',f'{h}:{p}'],capture_output=True,env=env).stdout.decode('utf-8','replace')
@functools.lru_cache(None)
def parse(h,p):
    t=blob(h,p); fm=t.split('\n---\n',1)[0]
    title=(re.search(r'^제목:\s*(.*)$',fm,re.M) or [None,''])[1].strip().strip("'")
    siheng=(re.search(r'^시행일자:\s*(.*)$',fm,re.M) or [None,''])[1].strip().strip("'")
    arts={}
    for m in re.finditer(r'^#####\s*제(\d+)조(?:의(\d+))?\s*(?:\(([^\n]*)\))?\s*\n(.*?)(?=^#{1,5}\s|\Z)',t,re.M|re.S):
        k=m[1]+('의'+m[2] if m[2] else ''); body=m[4].strip()
        arts[k]=((m[3] or '').strip(), body)
    return title,siheng,arts
def pick(ps,law):
    L=re.sub(r'\s','',law)
    pref=['시행령'] if L.endswith('시행령') else ['시행규칙'] if L.endswith('시행규칙') else ['법률','대통령령']
    for f in pref:
        c=[p for p in ps if p.rsplit('/',1)[1].startswith(f)]
        if c: return max(c,key=lambda p:ix['hist'][p][-1][0])
    ps2=[p for p in ps if '군정법령' not in p and '조선총독부' not in p] or ps
    return max(ps2,key=lambda p:ix['hist'][p][-1][0])
def version_at(p,d):
    v=[x for x in ix['hist'][p] if x[0]<=d]
    return v[-1] if v else None
def head(p): return ix['hist'][p][-1]
NS=lambda s:re.sub(r'\s','',s)
def deleted(ti,body): return (ti=='' and body.startswith('삭제')) or ti.startswith('삭제')
def term(c,law):
    ctx=c['ctx']; i=ctx.find(law) if law in ctx else 0
    s=ctx[i:]
    m=re.search(r'제\s*\d+\s*조(?:\s*의\s*\d+)?(?:\s*제\s*\d+\s*(?:항|호))*(?:\s*[가-하]목)?\s*(?:에\s*따른|에\s*따라|의|에서\s*정한|에\s*규정된|에\s*해당하는|에서\s*규정한)\s*([가-힣ㆍ]+(?:\s[가-힣ㆍ]+)?)',s)
    if not m: return None
    w=m[1].split()[0] if len(m[1].split()[0])>=3 else m[1]
    w=re.sub(r'(을|를|은|는|이|가|의|에|과|와|으로|로|에게|및|등)$','',w)
    return w if len(NS(w))>=3 and w not in('규정','바에','사항') else None
res=[]
for c in cites:
    ps=[p for p in c['paths'] if p!='ORD']
    if not ps or not c['arts']: continue
    # 법령구분 선택: 이름으로 이미 좁혀졌다고 보고 첫 경로
    p=pick(ps,c['law']); H=head(p); tnow,sh,anow=parse(H[1],p)
    ref=c['ptag'] or c['enact']; V=version_at(p,ref)
    for a in c['arts']:
        r=dict(c); r.update(path=p,a=a,ref=ref,lawnow=tnow,siheng=sh,lawlast=H[0])
        cur=anow.get(a)
        old=None
        if V: _,_,aold=parse(V[1],p); old=aold.get(a)
        r['old_title']=old[0] if old else None; r['now_title']=cur[0] if cur else None
        r['old_ver']=V[0] if V else None
        flags=[]
        if cur is None: flags.append('현행 조문 없음')
        elif deleted(*cur): flags.append('현행 조문 삭제')
        if old and cur and not deleted(*cur) and old[0]!=cur[0]:
            sim=difflib.SequenceMatcher(None,old[0],cur[0]).ratio(); r['tsim']=round(sim,2)
            flags.append('조문 제목 변경')
        if old and cur:
            r['bsim']=round(difflib.SequenceMatcher(None,NS(old[1])[:1500],NS(cur[1])[:1500]).ratio(),2)
        w=term(c,c['law']); r['term']=w
        if w and cur:
            inold=(NS(w) in NS(old[1]+old[0])) if old else None; innow=NS(w) in NS(cur[1]+cur[0])
            r['term_old']=inold; r['term_now']=innow
            if not innow: flags.append('인용 용어 현행 조문에 없음')
        if V is None: flags.append('기준시점 법령 없음')
        elif old is None and cur is not None: flags.append('기준시점 조문 없음')
        r['flags']=flags; res.append(r)
json.dump(res,open(S+'w/judged.json','w'),ensure_ascii=False)
cnt=collections.Counter(f for r in res for f in r['flags']); print(len(res),cnt)
