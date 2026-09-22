import sys,re,json
S='/tmp/claude-0/-home-claude/a26b1545-a4bb-52f0-9283-a44904f9e2bc/scratchpad/'
exec(open(S+'w/judge.py').read().split('res=[]')[0])
def show(p,a=None,kw=None,d=None,n=400):
    V=head(p) if d is None else version_at(p,d)
    t,sh,arts=parse(V[1],p)
    print(f'== {p} @{V[0]} 시행{sh}')
    if a: x=arts.get(a); print(a,x[0] if x else None,'|',(x[1][:n] if x else '')); 
    if kw:
        for k,v in arts.items():
            if kw in v[0] or kw in v[1]: print('  ',k,v[0],'|',v[1][max(0,v[1].find(kw)-80):v[1].find(kw)+80].replace('\n',' '))
