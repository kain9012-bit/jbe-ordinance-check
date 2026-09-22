import re,json,collections
S='/tmp/claude-0/-home-claude/a26b1545-a4bb-52f0-9283-a44904f9e2bc/scratchpad/'
N=lambda s:re.sub(r'[\s·・ㆍ]','',s)
hist=collections.defaultdict(list)  # path -> [(date,commit,name,type)]
cur=None
for line in open(S+'lk_log.txt'):
    line=line.rstrip('\n')
    if line.startswith('@@'):
        h,d,s=line[2:].split('|',2); m=re.match(r'([^:]+):\s*(.*)\s*\(([^()]*)\)\s*$',s)
        cur=(d[:10],h,m.group(2).strip() if m else None,m.group(3) if m else s)
    elif line.startswith('kr/') and cur:
        hist[line].append(cur)
names=collections.defaultdict(set); curname={}
for p,v in hist.items():
    v.sort()
    for d,h,n,t in v:
        if n: names[N(n)].add(p)
    nm=[x for x in v if x[2]]
    if nm: curname[p]=nm[-1][2]
json.dump({'hist':hist,'curname':curname,'names':{k:sorted(v) for k,v in names.items()}},open(S+'w/lkindex.json','w'),ensure_ascii=False)
cites=json.load(open(S+'w/cites.json'))
tg=json.load(open(S+'target.json')); ordn={N(r['name']) for r in tg}
un=collections.Counter()
for c in cites:
    k=N(c['law'])
    if k in names: c['paths']=sorted(names[k])
    elif k in ordn: c['paths']=['ORD']
    else: c['paths']=[]; un[c['law']]+=1
json.dump(cites,open(S+'w/cites.json','w'),ensure_ascii=False)
print(sum(1 for c in cites if c['paths'] and c['paths']!=['ORD']), sum(1 for c in cites if c['paths']==['ORD']), sum(un.values()), len(un))
for k,v in un.most_common(): print(v,k)
