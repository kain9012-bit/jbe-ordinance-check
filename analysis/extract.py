import json,re,collections
S='/tmp/claude-0/-home-claude/a26b1545-a4bb-52f0-9283-a44904f9e2bc/scratchpad/'
rows=json.load(open(S+'target.json'))
N=lambda s:re.sub(r'[\s·・]','',s).replace('ㆍ','ㆍ')
def pdate(s):
    m=re.match(r'(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})',s.strip()); return f'{int(m[1]):04d}-{int(m[2]):02d}-{int(m[3]):02d}' if m else None
ART=r'제\s*(\d+)\s*조(?:\s*의\s*(\d+))?'
out=[]
for r in rows:
    t=open(S+'ok/'+r['path']).read()
    body=t.split('\n---\n',1)[1] if '\n---\n' in t else t
    main,_,buchik=body.partition('\n## 부칙')
    # 제정일 = 부칙 최초 날짜
    ds=[pdate(m) for m in re.findall(r'<제\s*\d+\s*호\s*,\s*([\d\.\s]+)>',buchik)]
    ds=[d for d in ds if d]; r['enact']=min(ds) if ds else r['date']
    arts=re.split(r'\n#{3,6}\s*(제\s*\d+\s*조(?:\s*의\s*\d+)?)\s*',main)
    # arts: [pre, head1, text1, head2, text2...]
    abbr={}; last=None; lastkind=None
    for i in range(1,len(arts),2):
        ahead=arts[i]; atext=arts[i+1]
        title=(re.match(r'\(([^)]*)\)',atext.strip()) or [None,''])[1]
        # 항 단위로 나눔
        for para in re.split(r'\n\s*(?=[①-⑳])|\n\s*\d+\.\s',atext):
            tags=[pdate(x) for x in re.findall(r'(?:개정|신설|전문개정)\s*([\d\.\s,]+)>',para) for x in [x.split(',')[-1]] ]
            atags=[pdate(x.split(',')[-1]) for x in re.findall(r'(?:개정|신설|전문개정)\s*([\d\.\s,]+)>',atext)]
            ptag=max([d for d in tags if d],default=None); atag=max([d for d in atags if d],default=None)
            # 토큰화: 「X」 또는 같은 법/같은 영/법/영/시행령/시행규칙 + 조문
            pat=re.compile(r'「([^」]+)」|(같은\s*(?:법\s*시행령|법\s*시행규칙|법|영|규칙|조례|규정))|(?<![가-힣])(법|영|시행령|시행규칙)(?=\s*제\s*\d+\s*조)')
            for m in pat.finditer(para):
                if m.group(1):
                    law=m.group(1).strip(); last=law
                    rest=para[m.end():m.end()+60]
                    am=re.match(r'\s*\(이하\s*[“"]([^”"]+)[”"]',rest)
                    if am: abbr[am.group(1)]=law
                    src='direct'
                elif m.group(2):
                    g=re.sub(r'\s','',m.group(2))[2:]
                    if last is None: continue
                    base=re.sub(r'\s*(시행령|시행규칙)$','',last)
                    law={'법':base,'법시행령':base+' 시행령','법시행규칙':base+' 시행규칙','영':(last if last.endswith('시행령') or last.endswith('령') else base+' 시행령'),'규칙':last,'조례':last,'규정':last}[g]
                    src='same'
                else:
                    g=m.group(3)
                    if g in abbr: law=abbr[g]
                    elif g in('시행령','시행규칙') and last: law=re.sub(r'\s*(시행령|시행규칙)$','',last)+' '+g
                    else: continue
                    src='abbr'
                rest=para[m.end():m.end()+120]
                rest=re.sub(r'^\s*\([^)]*\)','',rest)  # (이하 ...) 제거
                # 연속 조문
                arts_=[]; pos=0
                while True:
                    mm=re.match(r'(?:\s|,|ㆍ|및|또는|부터|과|와|까지|의|제\s*\d+\s*(?:항|호)|[가-하]목)*?'+ART,rest[pos:])
                    if not mm: break
                    between=rest[pos:pos+mm.start(1)] if False else ''
                    arts_.append(mm.group(1)+('의'+mm.group(2) if mm.group(2) else ''))
                    pos+=mm.end()
                    if len(arts_)>6: break
                ctx=para[max(0,m.start()-10):m.end()+pos+40].replace('\n',' ')
                out.append(dict(ord=r['name'],kind=r['kind'],dept=r['dept'],odate=r['date'],enact=r['enact'],art=re.sub(r'\s','',ahead),atitle=title,law=law,src=src,arts=arts_,ptag=ptag,atag=atag,ctx=ctx.strip()))
json.dump(out,open(S+'w/cites.json','w'),ensure_ascii=False)
json.dump(rows,open(S+'target.json','w'),ensure_ascii=False)
print(len(out), sum(1 for o in out if o['arts']))
c=collections.Counter(o['law'] for o in out); print(len(c))
