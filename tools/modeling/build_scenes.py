"""Editable, deterministic mesh authoring source. Python 3 + numpy + Pillow.
No runtime primitives: swept bevelled timbers, sewn cloth surfaces, lathed vessels,
MPFB CC0 anatomical meshes with actual skeletal skinning. Units are metres.
The result is an authored reconstruction draft, NOT an ethnographic measurement.
"""
from pathlib import Path
from io import BytesIO
import gzip, json, math, struct
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/models'
VENDOR = Path(__file__).parent / 'vendor/mpfb'
TAU = math.tau

def texture_set(name, base, kind):
    n = 512; rng = np.random.default_rng(42)
    y,x = np.mgrid[:n,:n]; noise=rng.normal(0,1,(n,n))
    if kind=='wood': height = .5+.12*np.sin(x*.18+np.sin(y*.019)*2)+.06*np.sin(x*.81+np.sin(y*.03)*3)+noise*.028
    elif kind=='cloth': height=.5+.08*np.sin(x*math.pi/2)+.08*np.sin(y*math.pi/2)+noise*.055
    elif kind=='soil': height=.5+noise*.18+.08*np.sin(x*.052)*np.sin(y*.038)
    else: height=.5+noise*.045+.018*np.sin(x*.7)*np.sin(y*.6)
    rgb=np.clip(np.array(base)[None,None,:]*(.80+height[...,None]*.32),0,255).astype('uint8')
    image=Image.fromarray(rgb)
    if name=='ornament':
        draw=ImageDraw.Draw(image)
        for cx in range(32,512,64):
            for cy in range(32,512,64):
                # Authored ram-horn-inspired paired scroll, not a copied historical motif.
                for sign in [-1,1]:
                    points=[]
                    for t in np.linspace(0,math.pi*3,90):
                        r=2+t*1.8;points.append((cx+sign*(10+r*math.cos(t)),cy+r*math.sin(t)))
                    draw.line(points,fill=(204,167,89),width=3)
        rgb=np.asarray(image)
    gy,gx=np.gradient(height); normal=np.stack([-gx*2,-gy*2,np.ones_like(gx)],axis=-1);normal/=np.linalg.norm(normal,axis=-1)[...,None]
    normal=((normal*.5+.5)*255).astype('uint8')
    rough=np.clip(.78+(height-.5)*.18,0,1)
    mr=np.stack([np.ones_like(rough),rough,np.zeros_like(rough)],-1)
    result=[]
    for suffix,im in [('base',image),('normal',Image.fromarray(normal)),('mr',Image.fromarray((mr*255).astype('uint8')))]:
        ext='jpg' if suffix=='base' else 'png'
        path=OUT/'textures'/f'{name}_{suffix}.{ext}'
        if suffix=='base':im.save(path,quality=88,optimize=True)
        else:im.resize((256,256),Image.Resampling.LANCZOS).save(path,optimize=True)
        result.append(path)
    return result

TEXTURES={name:texture_set(name,base,kind) for name,base,kind in [
    ('wood',(124,68,32),'wood'),('felt',(218,210,190),'felt'),
    ('ornament',(77,29,30),'cloth'),('linen',(227,222,207),'cloth'),
    ('leather',(42,28,23),'felt'),('skin',(184,129,98),'felt'),('earth',(113,100,72),'soil')]}

class GLB:
    def __init__(self,name):
        self.doc={'asset':{'version':'2.0','generator':'Zerde mesh authoring v1','copyright':'Authored meshes; MPFB anatomical core CC0. See ASSET_PROVENANCE.md'},'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'materials':[],'accessors':[],'bufferViews':[],'buffers':[],'images':[],'textures':[],'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':10497,'wrapT':10497}],'animations':[],'skins':[]}
        self.buffer=bytearray();self.mat={};self.name=name;self.channels=[];self.samplers=[]
        self.node(name,extras={'reconstructionStatus':'draft-unreviewed','metres':True})
    def view(self,data,target=None):
        while len(self.buffer)%4:self.buffer.append(0)
        i=len(self.doc['bufferViews']);v={'buffer':0,'byteOffset':len(self.buffer),'byteLength':len(data)}
        if target:v['target']=target
        self.buffer.extend(data);self.doc['bufferViews'].append(v);return i
    def acc(self,data,typ,component=5126,target=None):
        dtypes={5126:'<f4',5123:'<u2',5125:'<u4'};a=np.asarray(data,dtype=dtypes[component]);v=self.view(a.tobytes(),target)
        d={'bufferView':v,'componentType':component,'count':len(a),'type':typ}
        if typ!='MAT4':
            d['min']=a.reshape(len(a),-1).min(axis=0).tolist();d['max']=a.reshape(len(a),-1).max(axis=0).tolist()
        i=len(self.doc['accessors']);self.doc['accessors'].append(d);return i
    def material(self,name,colour=(1,1,1),tex=None,rough=.8,metal=0):
        if name in self.mat:return self.mat[name]
        m={'name':name,'pbrMetallicRoughness':{'baseColorFactor':[*colour,1],'metallicFactor':metal,'roughnessFactor':rough},'doubleSided':True}
        if tex:
            ids=[]
            for p in TEXTURES[tex]:
                idx=len(self.doc['images']);self.doc['images'].append({'bufferView':self.view(p.read_bytes()),'mimeType':('image/jpeg' if p.suffix=='.jpg' else 'image/png'),'name':p.stem})
                tid=len(self.doc['textures']);self.doc['textures'].append({'source':idx,'sampler':0});ids.append(tid)
            m['pbrMetallicRoughness']['baseColorTexture']={'index':ids[0]};m['normalTexture']={'index':ids[1],'scale':.35}
            m['pbrMetallicRoughness']['metallicRoughnessTexture']={'index':ids[2]}
        i=len(self.doc['materials']);self.doc['materials'].append(m);self.mat[name]=i;return i
    def node(self,name,parent=0,pos=None,extras=None):
        i=len(self.doc['nodes']);n={'name':name}
        if pos is not None:n['translation']=list(pos)
        if extras:n['extras']=extras
        self.doc['nodes'].append(n)
        if i==0:self.doc['scenes'][0]['nodes'].append(i)
        else:self.doc['nodes'][parent].setdefault('children',[]).append(i)
        return i
    def mesh(self,name,vertices,faces,material,parent=0,uv=None,joints=None,weights=None,skin=None,extras=None):
        v=np.array(vertices,dtype=float);f=np.asarray(faces,dtype=np.uint32).reshape(-1,3)
        fn=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
        valid=np.linalg.norm(fn,axis=1)>1e-12;f=f[valid];fn=fn[valid]
        normals=np.zeros_like(v)
        for k in range(3):np.add.at(normals,f[:,k],fn)
        zero=np.linalg.norm(normals,axis=1)<1e-12;normals[zero]=[0,1,0]
        normals/=np.maximum(np.linalg.norm(normals,axis=1)[:,None],1e-12)
        if uv is None:uv=v[:,[0,1]]
        attr={'POSITION':self.acc(v,'VEC3',target=34962),'NORMAL':self.acc(normals,'VEC3',target=34962),'TEXCOORD_0':self.acc(uv,'VEC2',target=34962)}
        if joints is not None:attr['JOINTS_0']=self.acc(joints,'VEC4',5123,34962);attr['WEIGHTS_0']=self.acc(weights,'VEC4',target=34962)
        mid=len(self.doc['meshes']);self.doc['meshes'].append({'name':name,'primitives':[{'attributes':attr,'indices':self.acc(f.ravel(),'SCALAR',5125,34963),'material':material}]})
        node=self.node(name,parent,extras=extras);self.doc['nodes'][node]['mesh']=mid
        if skin is not None:self.doc['nodes'][node]['skin']=skin
        return node
    def track(self,node,path,times,values,typ,interpolation='LINEAR'):
        si=len(self.samplers);self.samplers.append({'input':self.acc(times,'SCALAR'),'output':self.acc(values,typ),'interpolation':interpolation});self.channels.append({'sampler':si,'target':{'node':node,'path':path}})
    def write(self,duration):
        # glTF skinned mesh transforms are defined by the joint hierarchy. Keep
        # skinned render nodes at scene root to avoid ambiguous parent transforms.
        for index,node in enumerate(self.doc['nodes']):
            if 'skin' not in node:continue
            for parent in self.doc['nodes']:
                if index in parent.get('children',[]):parent['children'].remove(index)
            self.doc['scenes'][0]['nodes'].append(index)
            node.setdefault('extras',{}).update({'hotspot':'community'})
        if self.channels:self.doc['animations'].append({'name':'EducationalTimeline','samplers':self.samplers,'channels':self.channels,'extras':{'stageDuration':4,'duration':duration}})
        while len(self.buffer)%4:self.buffer.append(0)
        self.doc['buffers']=[{'byteLength':len(self.buffer)}]
        raw=json.dumps(self.doc,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4)
        total=12+8+len(raw)+8+len(self.buffer)
        (OUT/f'{self.name}.glb').write_bytes(struct.pack('<III',0x46546c67,2,total)+struct.pack('<II',len(raw),0x4e4f534a)+raw+struct.pack('<II',len(self.buffer),0x004e4942)+self.buffer)
        # Textual authoring scene with identical buffers is editable in Blender or glTF tools.
        doc=dict(self.doc);doc['buffers']=[{'byteLength':len(self.buffer),'uri':f'{self.name}.bin'}]
        src=ROOT/'tools/modeling/scenes';src.mkdir(exist_ok=True)
        (src/f'{self.name}.gltf').write_text(json.dumps(doc,indent=2));(src/f'{self.name}.bin').write_bytes(self.buffer)
        return {'file':f'{self.name}.glb','bytes':total,'meshes':len(self.doc['meshes']),'triangles':sum(self.doc['accessors'][p['indices']]['count']//3 for m in self.doc['meshes'] for p in m['primitives']),'bones':sum(len(s['joints']) for s in self.doc['skins']),'animationChannels':len(self.channels)}

def grid(rows,cols,fn,closed=False):
    v=[];uv=[];f=[]
    for j in range(rows+1):
        for i in range(cols+1):v.append(fn(i/cols,j/rows));uv.append((i/cols,j/rows))
    for j in range(rows):
        for i in range(cols):
            a=j*(cols+1)+i;b=a+1;c=a+cols+1;d=c+1;f.extend([(a,c,b),(b,c,d)])
    return v,f,uv

def sweep(path,w=.028,h=None,bevel=.2):
    """Eight-edge bevelled rectangular cross section; grain follows rail length."""
    h=h or w;section=[(-1,-1+bevel),(-1+bevel,-1),(1-bevel,-1),(1,-1+bevel),(1,1-bevel),(1-bevel,1),(-1+bevel,1),(-1,1-bevel)]
    p=np.array(path);v=[];uv=[];f=[];dist=0
    for i,point in enumerate(p):
        t=p[min(i+1,len(p)-1)]-p[max(0,i-1)];t/=max(np.linalg.norm(t),1e-8);n=np.cross(t,[0,0,1])
        if np.linalg.norm(n)<.01:n=np.cross(t,[1,0,0])
        n/=np.linalg.norm(n);b=np.cross(t,n)
        if i:dist+=np.linalg.norm(p[i]-p[i-1])
        for k,(x,y) in enumerate(section):v.append(point+n*x*w/2+b*y*h/2);uv.append((k/8,dist*2))
    for i in range(len(p)-1):
        for k in range(8):a=i*8+k;b=i*8+(k+1)%8;c=(i+1)*8+k;d=(i+1)*8+(k+1)%8;f.extend([(a,b,c),(b,d,c)])
    for k in range(1,7):f.extend([(0,k+1,k),((len(p)-1)*8,(len(p)-1)*8+k,(len(p)-1)*8+k+1)])
    return v,f,uv

def add_sweep(g,name,path,mat,parent=0,w=.028,h=None):
    v,f,u=sweep(path,w,h);return g.mesh(name,v,f,mat,parent,u)

def lathe(g,name,profile,mat,parent=0,centre=(0,0,0),segments=64,warp=0):
    p=np.array(profile);n=len(p)-1
    def fn(u,v):
        idx=min(int(v*n),n-1);t=v*n-idx;r,y=p[idx]*(1-t)+p[idx+1]*t;a=u*TAU
        rr=r*(1+warp*math.sin(a*7+v*3));return [centre[0]+rr*math.cos(a),centre[1]+y,centre[2]+rr*math.sin(a)]
    v,f,u=grid(n,segments,fn);return g.mesh(name,v,f,mat,parent,u)

def cloth(g,name,fn,mat,parent=0,rows=24,cols=96):
    v,f,u=grid(rows,cols,fn);return g.mesh(name,v,f,mat,parent,u)

def stage_visibility(g,node,start,end=16):
    # Full-size authored model is the static default, portable to AR viewers.
    times=[0,start,start+1.5,end] if start>0 else [0,1.5,end]
    values=[[.00001]*3,[.001]*3,[1]*3,[1]*3] if start>0 else [[.001]*3,[1]*3,[1]*3]
    g.track(node,'scale',times,values,'VEC3')

def mats(g):
    return {k:g.material(k,tex=k) for k in TEXTURES}|{'brass':g.material('brass',(0.73,.50,.21),rough=.28,metal=.85),'silver':g.material('silver',(.66,.69,.71),rough=.2,metal=.95),'black':g.material('black-wool',(.07,.065,.06)), 'white':g.material('white-wool',(.86,.84,.77)), 'blue':g.material('blue-cloth',(.19,.36,.52),tex='linen'), 'red':g.material('red-cloth',(.64,.2,.19),tex='linen'),'food':g.material('baked-dough',(.78,.46,.16),rough=.87),'kozhe':g.material('kozhe',(.81,.76,.62),rough=.44),'eye':g.material('dark-iris',(.045,.025,.015),rough=.27),'sclera':g.material('sclera',(.77,.74,.67),rough=.35)}

def ground(g,m,radius=3.9):
    # Raised irregular terrain patch, not an infinite primitive floor.
    lathe(g,'steppe-terrain',[(0,-.04),(radius,-.04),(radius,.0),(0,.0)],m['earth'],segments=160,warp=.005)

def yurt(g,m,parent=0,animated=False,cutaway=False):
    structure=g.node('yurt',parent,extras={'hotspot':'kerege'})
    wall=g.node('kerege',structure,extras={'hotspot':'kerege'});R=2.05;H=1.48
    # Wooden lattice rails trace real cylindrical wall arcs; door opening at +Z.
    for k in range(72):
        for direction in [-1,1]:
            a0=k*TAU/72+.25
            path=[]
            for t in np.linspace(0,1,9):
                a=a0+direction*(t-.5)*.32
                if abs(math.atan2(math.sin(a),math.cos(a)))<.20:break
                path.append([R*math.sin(a),.05+t*H,R*math.cos(a)])
            if len(path)>1:add_sweep(g,f'kerege-rail-{k}-{direction}',path,m['wood'],wall,w=.022,h=.035)
    # Rawhide lashings at lattice crossings, explicitly modelled knotted bands.
    for k in range(66):
        a=.27+k*(TAU-.54)/66
        for y in [.27,.63,.99,1.35]:
            centre=np.array([R*math.sin(a),y,R*math.cos(a)])
            path=[centre+np.array([math.cos(a)*math.cos(t)*.02,math.sin(t)*.034,-math.sin(a)*math.cos(t)*.02]) for t in np.linspace(0,TAU,13)]
            add_sweep(g,f'rawhide-binding-{k}-{y}',path,m['leather'],wall,w=.005)
    door=g.node('sykyrlauyq',wall,extras={'hotspot':'door'})
    for x in [-.41,.41]:add_sweep(g,f'door-post-{x}',[[x,0,R],[x,H+.06,R]],m['wood'],door,w=.085,h=.07)
    for y in [.04,H+.04]:add_sweep(g,f'door-crossbeam-{y}',[[-.45,y,R],[.45,y,R]],m['wood'],door,w=.085,h=.085)
    # Inset framed door leaves with geometric carved relief.
    for side in [-1,1]:
        x=.20*side
        for xx in [-.16,.16]:add_sweep(g,f'leaf-upright-{side}-{xx}',[[x+xx,.12,R+.02],[x+xx,1.4,R+.02]],m['wood'],door,w=.046,h=.034)
        for yy in [.16,.6,1.06,1.39]:add_sweep(g,f'leaf-rail-{side}-{yy}',[[x-.16,yy,R+.02],[x+.16,yy,R+.02]],m['wood'],door,w=.035,h=.032)
        for yy in [.37,.82,1.23]:
            add_sweep(g,f'leaf-carving-{side}-{yy}',[[x,yy-.14,R+.035],[x+.11,yy,R+.045],[x,yy+.14,R+.035],[x-.11,yy,R+.045],[x,yy-.14,R+.035]],m['brass'],door,w=.009)
    crown=g.node('shanyraq',structure,pos=(0,2.55,0),extras={'hotspot':'shanyraq'})
    # Actual radial mortises between two continuous rim bands. Uyk ends enter
    # these openings, rather than black decals painted onto a solid cylinder.
    for label,lo,hi in [('lower',-.07,-.018),('upper',.018,.065)]:
        lathe(g,'shanyraq-rim-'+label,[(.47,lo),(.56,lo),(.56,hi),(.47,hi),(.47,lo)],m['wood'],crown)
    for k in range(64):
        a0=k*TAU/64+.035;a1=(k+1)*TAU/64-.035
        profile=np.array([[.47,-.018],[.56,-.018],[.56,.018],[.47,.018],[.47,-.018]])
        def mortise_web(u,v,a0=a0,a1=a1):
            idx=min(int(v*4),3);t=v*4-idx;r,y=profile[idx]*(1-t)+profile[idx+1]*t;a=a0+(a1-a0)*u
            return [r*math.sin(a),y,r*math.cos(a)]
        cloth(g,'shanyraq-socket-web-'+str(k),mortise_web,m['wood'],crown,rows=4,cols=3)
    for x in [-.16,0,.16]:
        for rotate in [False,True]:
            path=[]
            for t in np.linspace(-1,1,25):
                q=t*math.sqrt(.49**2-x*x);y=.20*(1-t*t)
                path.append([x,y,q] if not rotate else [q,y,x])
            add_sweep(g,f'kuldireuish-{x}-{rotate}',path,m['wood'],crown,w=.022,h=.035)
    supports=g.node('bakan',structure,extras={'hotspot':'bakan'})
    add_sweep(g,'forked-support-shaft',[[.10,.0,-.03],[.06,2.46,-.03]],m['wood'],supports,w=.055,h=.047)
    for side in [-1,1]:add_sweep(g,f'fork-{side}',[[.06,2.31,-.03],[side*.15,2.54,-.03]],m['wood'],supports,w=.026)
    poles=g.node('uyk',structure,extras={'hotspot':'uyk'})
    for k in range(64):
        a=.24+k*(TAU-.48)/63;path=[]
        for t in np.linspace(0,1,22):
            r=R*(1-t)+.53*t;y=H+.05+1.02*(t**.72)
            path.append([r*math.sin(a),y,r*math.cos(a)])
        p=add_sweep(g,f'curved-uyk-{k}',path,m['wood'],poles,w=.023,h=.033)
        if animated:
            st=8+(k/64)*2.5;g.track(p,'translation',[0,st,st+1,16],[[0,-1.45,.55],[0,-1.45,.55],[0,0,0],[0,0,0]],'VEC3')
    felt=g.node('kiiz',structure,extras={'hotspot':'kiiz'})
    # Open entry; Nauryz cutaway deliberately exposes interior for study.
    amin=.24 if not cutaway else .90;amax=TAU-.24 if not cutaway else TAU-.90
    for panel in range(8):
        a0=amin+(amax-amin)*panel/8;a1=amin+(amax-amin)*(panel+1)/8
        def wall_fn(u,v,a0=a0,a1=a1):
            a=a0+(a1-a0)*u;r=R+.038+.009*math.sin(v*21+u*4)+.004*math.sin(u*65)
            return [r*math.sin(a),.035+v*H,r*math.cos(a)]
        cloth(g,f'tuyrlyq-panel-{panel}',wall_fn,m['felt'],felt,rows=18,cols=18)
        edge=[wall_fn(0,t) for t in np.linspace(0,1,20)];add_sweep(g,f'felt-seam-{panel}',edge,m['linen'],felt,w=.008)
        def roof_fn(u,v,a0=a0,a1=a1):
            a=a0+(a1-a0)*u;r=.59+(R-.59)*v;y=2.59-1.05*(v**1.26)+.012*math.sin(u*38+v*6)
            return [r*math.sin(a),y,r*math.cos(a)]
        cloth(g,f'uzik-panel-{panel}',roof_fn,m['felt'],felt,rows=22,cols=18)
    cloth(g,'basqur-woven-belt',lambda u,v:[(R+.052)*math.sin(amin+(amax-amin)*u),1.27+v*.15,(R+.052)*math.cos(amin+(amax-amin)*u)],m['ornament'],felt,rows=3,cols=128)
    # Tundik is folded back; smoke/light opening remains legible.
    cloth(g,'folded-tundik',lambda u,v:[-.55+u*1.1,2.62-1.05*(max(0,math.hypot(-.55+u*1.1,-.9+v*.5)-.59)/(R-.59))**1.26+.009*math.sin(v*math.pi*5),-.9+v*.5],m['felt'],felt,rows=18,cols=32)
    for y in [.58,1.13]:
        add_sweep(g,f'outer-lashing-{y}',[[(R+.065)*math.sin(a),y,(R+.065)*math.cos(a)] for a in np.linspace(amin,amax,160)],m['leather'],felt,w=.018)
    if animated:
        stage_visibility(g,wall,0);stage_visibility(g,crown,4);g.doc['nodes'][supports]['scale']=[.00001]*3;g.track(supports,'scale',[0,4,5.5,13,15,16],[[.00001]*3,[.00001]*3,[1]*3,[1]*3,[.00001]*3,[.00001]*3],'VEC3');stage_visibility(g,poles,8);stage_visibility(g,felt,12)
        g.track(crown,'translation',[0,4,7.5,16],[[0,.20,1.1],[0,.20,1.1],[0,2.55,0],[0,2.55,0]],'VEC3')
        g.track(wall,'rotation',[0,3.5,16],[[0,math.sin(-.25),0,math.cos(-.25)],[0,0,0,1],[0,0,0,1]],'VEC4')
    return structure

# Load CC0 anatomical topology, helpers, morphs and vertex weights once.
BASE=[];UV=[];OBJ=[];GROUPS={};group=''
for line in (VENDOR/'base.obj').read_text().splitlines():
    s=line.split()
    if not s:continue
    if s[0]=='v':BASE.append([float(x) for x in s[1:4]])
    elif s[0]=='vt':UV.append([float(x) for x in s[1:3]])
    elif s[0]=='g':group=' '.join(s[1:])
    elif s[0]=='f':
        corners=[(int(x.split('/')[0])-1,int(x.split('/')[1])-1) for x in s[1:]]
        OBJ.append((group,corners));GROUPS.setdefault(group,set()).update(c[0] for c in corners)
BASE=np.array(BASE);RIG=json.loads((VENDOR/'rig.json').read_text());BONES=list(RIG);WEIGHTS=json.loads((VENDOR/'weights.json').read_text())['weights']
JW=np.zeros((len(BASE),len(BONES)))
for bi,b in enumerate(BONES):
    for vi,w in WEIGHTS[b]:JW[vi,bi]=w
# Helpers do not have anatomical weights; inherit nearest anatomical vertex.
for vi in range(13380,len(BASE)):
    if JW[vi].sum()<.001:
        nearest=np.argmin(np.sum((BASE[:13380]-BASE[vi])**2,axis=1));JW[vi]=JW[nearest]
J=np.argsort(-JW,axis=1)[:,:4];W=np.take_along_axis(JW,J,axis=1);W/=np.maximum(W.sum(axis=1)[:,None],1e-8);J[W==0]=0

def quat(axis,angle):
    a=np.array(axis,dtype=float);a/=np.linalg.norm(a);return [*(a*math.sin(angle/2)),math.cos(angle/2)]

def person(g,m,name,position,gender='male',age='young',pose='relaxed',yaw=0,animated=False):
    p=BASE.copy();target=VENDOR/f'asian-{gender}-{age}.target.gz'
    with gzip.open(target,'rt') as stream:
        for l in stream:
            s=l.split()
            if len(s)==4 and not s[0].startswith('#'):p[int(s[0])]+=np.array([float(x) for x in s[1:]])
    height=.82 if age=='baby' else (1.65 if gender=='female' else 1.76)
    bottom=p[:13380,1].min();factor=height/(p[:13380,1].max()-bottom);p[:,1]-=bottom;p*=factor
    root=g.node(name,pos=position,extras={'hotspot':'community','anatomy':'MPFB CC0; culturally adapted garment draft'})
    g.doc['nodes'][root]['rotation']=quat([0,1,0],yaw)
    heads=[]
    for b in BONES:
        head=RIG[b]['head'];c=head.get('cube_name')
        if c in GROUPS:heads.append(p[list(GROUPS[c])].mean(axis=0))
        elif head.get('vertex_indices'):heads.append(p[head['vertex_indices']].mean(axis=0))
        else:heads.append(np.zeros(3))
    heads=np.array(heads);bn={}
    for i,b in enumerate(BONES):bn[b]=g.node(name+'-'+b,root)
    # Move joints into actual parent hierarchy. Rest joint axes share global axes.
    for i,b in enumerate(BONES):
        parent=RIG[b]['parent'];h=heads[i]
        if parent:
            g.doc['nodes'][root]['children'].remove(bn[b]);g.doc['nodes'][bn[parent]].setdefault('children',[]).append(bn[b]);h=h-heads[BONES.index(parent)]
        g.doc['nodes'][bn[b]]['translation']=h.tolist()
    ib=[]
    for h in heads:
        mm=np.eye(4);mm[:3,3]=-h;ib.append(mm.T.ravel())
    skin=len(g.doc['skins']);g.doc['skins'].append({'name':name+'-53-bone-rig','joints':[bn[b] for b in BONES],'skeleton':bn['Root'],'inverseBindMatrices':g.acc(ib,'MAT4')})
    # Garment shell follows actual body topology; collar, hem and sash added below.
    buckets={};lookup={};verts={};uvs={};joints={};weights={}
    dominant=np.argmax(JW,axis=1)
    def category(vi):
        b=BONES[dominant[vi]]
        if b in ['head','neck_01'] or 'hand' in b or any(k in b for k in ['thumb','index','middle','ring','pinky']):return 'skin'
        if any(k in b for k in ['ball','foot']):return 'leather'
        if any(k in b for k in ['thigh','calf']):return 'blue'
        return 'red' if gender=='female' else 'blue'
    for grp,corners in OBJ:
        if grp!='body':continue
        cat=category(corners[0][0]);buckets.setdefault(cat,[]);lookup.setdefault(cat,{});verts.setdefault(cat,[]);uvs.setdefault(cat,[]);joints.setdefault(cat,[]);weights.setdefault(cat,[])
        indices=[]
        for vi,ui in corners:
            key=(vi,ui)
            if key not in lookup[cat]:
                q=p[vi].copy()
                if cat not in ['skin','leather']:
                    # Cloth slack and longitudinal fold relief, in anatomical rest space.
                    q[0]*=1.045;q[2]*=1.12;q[2]+=.006*math.sin(q[1]*49+q[0]*37)
                lookup[cat][key]=len(verts[cat]);verts[cat].append(q);uvs[cat].append(UV[ui]);joints[cat].append(J[vi]);weights[cat].append(W[vi])
            indices.append(lookup[cat][key])
        for k in range(1,len(indices)-1):buckets[cat].append((indices[0],indices[k],indices[k+1]))
    for cat in buckets:g.mesh(name+'-'+cat,verts[cat],buckets[cat],m[cat],root,uvs[cat],joints[cat],weights[cat],skin)
    # Anatomical eye helper meshes, not sphere heads or painted facial features.
    for grp in ['helper-l-eye','helper-r-eye']:
        v=[];f=[];u=[];js=[];ws=[];lookup_eye={}
        for gr,corners in OBJ:
            if gr!=grp:continue
            ix=[]
            for vi,ui in corners:
                if (vi,ui) not in lookup_eye:
                    lookup_eye[vi,ui]=len(v);v.append(p[vi]);u.append(UV[ui]);js.append([BONES.index('head'),0,0,0]);ws.append([1,0,0,0])
                ix.append(lookup_eye[vi,ui])
            for k in range(1,len(ix)-1):f.append((ix[0],ix[k],ix[k+1]))
        if v:g.mesh(name+'-'+grp,v,f,m['sclera'],root,u,js,ws,skin)
        center=p[list(GROUPS[grp])].mean(axis=0);center[2]+= .018 if age=='baby' else .025
        # A curved iris patch rests on the anatomical eye surface.
        v,f,u=grid(5,24,lambda u,v:[center[0]+math.cos(u*TAU)*v*height*.006,center[1]+math.sin(u*TAU)*v*height*.006,center[2]+(1-v*v)*.0015])
        js=[[BONES.index('head'),0,0,0]]*len(v);ws=[[1,0,0,0]]*len(v)
        g.mesh(name+'-iris-'+grp,v,f,m['eye'],root,u,js,ws,skin)
    pelvis=BONES.index('pelvis');headidx=BONES.index('head');chest=BONES.index('spine_03')
    def skinned_surface(label,fn,mat,bone,rows=20,cols=64):
        v,f,u=grid(rows,cols,fn);g.mesh(name+'-'+label,v,f,mat,root,u,[[bone,0,0,0]]*len(v),[[1,0,0,0]]*len(v),skin)
    # Robe skirt: loose pleated cloth rather than anatomical trousers painted red.
    if age!='baby':
        skinned_surface('chapan-hem',lambda u,v:[(height*(.135-.035*v)+.007*math.sin(u*TAU*14)*(1-v))*math.cos(u*TAU),height*(.29+.32*v),height*(.092-.009*v)*math.sin(u*TAU)],m['red'] if gender=='female' else m['blue'],pelvis)
        skinned_surface('embroidered-hem',lambda u,v:[height*.136*math.cos(u*TAU),height*(.29+.023*v),height*.093*math.sin(u*TAU)],m['ornament'],pelvis,rows=3)
    # Taqiya with sewn dome and brocade band; follows head joint.
    top=p[:13380,1].max();cz=np.median(p[:13380][p[:13380,1]>top-height*.05,2]);hatR=height*.060
    skinned_surface('taqiya',lambda u,v:[hatR*math.cos(v*math.pi/2)*math.cos(u*TAU),top-height*.035+height*.045*math.sin(v*math.pi/2),cz+hatR*math.cos(v*math.pi/2)*math.sin(u*TAU)],m['ornament'],headidx,rows=16)
    skinned_surface('taqiya-band',lambda u,v:[hatR*math.cos(u*TAU),top-height*.045+height*.024*v,cz+hatR*math.sin(u*TAU)],m['ornament'],headidx,rows=4)
    # Sash and paired embroidered front lapels.
    skinned_surface('woven-sash',lambda u,v:[height*.105*math.cos(u*TAU),height*(.535+.028*v),height*.088*math.sin(u*TAU)],m['ornament'],pelvis,rows=3)
    for side in [-1,1]:
        skinned_surface('lapel-'+str(side),lambda u,v,side=side:[side*height*(.015+.085*v)+height*.017*u,height*(.55+.27*v),height*(.099-.03*v)],m['ornament'],chest,rows=20,cols=4)
    # Skeletal poses. Character hand positions still require manual artist review.
    for side,sign in [('l',1),('r',-1)]:
        angle=.48*sign if pose=='relaxed' else -.36*sign
        g.doc['nodes'][bn['upperarm_'+side]]['rotation']=quat([0,0,1],angle)
        g.doc['nodes'][bn['lowerarm_'+side]]['rotation']=quat([1,0,0],-.35 if pose=='relaxed' else -1.05)
    if animated:
        for side,sign in [('l',1),('r',-1)]:
            values=[quat([0,0,1],a*sign) for a in [.48,.28,-.38,-.45,-.18,.48]]
            g.track(bn['upperarm_'+side],'rotation',[0,4,6,8,12,16],values,'VEC4')
            g.track(bn['lowerarm_'+side],'rotation',[0,4,6,8,12,16],[quat([1,0,0],a) for a in [-.35,-.4,-1.2,-1.05,-.8,-.35]],'VEC4')
    return root,bn,height

def asar():
    g=GLB('asar');m=mats(g);ground(g,m);yurt(g,m,animated=True)
    person(g,m,'elder-helper',(0,0,.40),pose='working',animated=True,yaw=math.pi)
    person(g,m,'west-helper',(-2.35,0,.15),pose='working',animated=True,yaw=math.pi/2)
    person(g,m,'east-helper',(2.35,0,-.25),gender='female',pose='working',animated=True,yaw=-math.pi/2)
    # Spare rails, rolled felt and coils visually explain shared labour.
    for k in range(6):add_sweep(g,f'spare-uyk-{k}',[[-2.8+k*.06,.06,-1.2],[-2.7+k*.06,.12,.55]],m['wood'],w=.025)
    for k in range(2):lathe(g,f'rolled-felt-{k}',[(0,0),(.21,0),(.22,.58),(.19,.62),(0,.62)],m['felt'],centre=(2.7,0,-1.4+k*.6),warp=.03)
    g.doc['nodes'][0].setdefault('extras',{}).update({'culturalReview':'required'})
    return g.write(16)

def bowl(g,m,name,centre,scale=.20,mat='wood'):
    profile=np.array([(0,0),(.6,.02),(1,.35),(1.04,.42),(1,.46),(.93,.39),(.5,.10),(0,.09)])*scale
    return lathe(g,name,profile,m[mat],centre=centre,segments=56)

def bread(g,m,name,centre,seed,size=1,parent=0):
    # Rounded uneven pillow-shaped fried dough with a folded crease and dimples.
    rng=np.random.default_rng(seed);s=(.06+rng.random()*.025)*size;v=[];f=[];uv=[]
    for bottom in [False,True]:
        vv,ff,uu=grid(10,32,lambda u,v:[centre[0]+s*(math.cos(u*TAU))*math.sin(v*math.pi/2)*(1+.045*math.sin(u*27)),centre[1]+(-1 if bottom else 1)*s*.48*math.cos(v*math.pi/2)+.004*math.sin(u*13)*v,centre[2]+s*.7*math.sin(u*TAU)*math.sin(v*math.pi/2)])
        off=len(v);v.extend(vv);f.extend([(a+off,b+off,c+off) if not bottom else (c+off,b+off,a+off) for a,b,c in ff]);uv.extend(uu)
    return g.mesh(name,v,f,m['food'],parent,uv=uv)

def nauryz():
    g=GLB('nauryz');m=mats(g);ground(g,m);yurt(g,m,cutaway=True)
    cloth(g,'tekemet',lambda u,v:[-1.8+u*3.6,.021+.003*math.sin(u*60)*math.sin(v*49),-1.7+v*3.2],m['ornament'],rows=32,cols=48)
    table=g.node('dastarkhan',extras={'hotspot':'dastarkhan'})
    lathe(g,'carved-table-top',[(0,.32),(.91,.32),(.94,.34),(.94,.39),(.90,.41),(0,.41)],m['wood'],table,segments=96)
    for a in np.linspace(0,TAU,4,endpoint=False):
        add_sweep(g,'carved-table-leg-'+str(a),[[.64*math.cos(a),.02,.64*math.sin(a)],[.59*math.cos(a),.16,.59*math.sin(a)],[.64*math.cos(a),.34,.64*math.sin(a)]],m['wood'],table,w=.072,h=.068)
    cloth(g,'dastarkhan-linen',lambda u,v:[-1+u*2,.418-.10*max(0,abs(-1+u*2)-.87)/.13-.10*max(0,abs(-1+v*2)-.87)/.13+.006*math.sin(u*45+v*3),-1+v*2],m['linen'],table,rows=40,cols=40)
    astau=g.node('astau',extras={'hotspot':'baursak'})
    # Oval carved platter, separate inner and outer contour.
    n=lathe(g,'astau-carved-platter',[(0,0),(.22,0),(.28,.045),(.30,.07),(.29,.08),(.25,.065),(0,.018)],m['wood'],astau,centre=(0,0,0))
    g.doc['nodes'][n]['translation']=[0,.43,0]
    g.doc['nodes'][n]['scale']=[1.5,1,.75]
    for k in range(24):
        a=k*2.39996;r=.047*math.sqrt(k);bread(g,m,'baursak-'+str(k),(r*math.cos(a)*1.35,.51+(k%3)*.014,r*math.sin(a)*.65),k,parent=astau)
    kozhe=g.node('nauryz-kozhe',extras={'hotspot':'kozhe'})
    for k in range(7):
        a=k*TAU/7;cx=.64*math.cos(a);cz=.64*math.sin(a)
        bowl(g,m,'kozhe-tostagan-'+str(k),(cx,.43,cz),.14)
        lathe(g,'kozhe-surface-'+str(k),[(0,0),(.115,0),(.116,.002),(0,.002)],m['kozhe'],kozhe,centre=(cx,.482,cz),segments=48)
        for seed in range(5):bread(g,m,f'grain-{k}-{seed}',(cx+.065*math.cos(seed*2),.486,cz+.065*math.sin(seed*2)),seed+100,size=.055,parent=kozhe)
    vessels=g.node('traditional-vessels',extras={'hotspot':'vessels'})
    lathe(g,'wooden-torsyk-inspired-vessel',[(0,0),(.12,0),(.22,.12),(.25,.28),(.17,.42),(.05,.47),(.05,.57),(.07,.59)],m['leather'],vessels,centre=(-1.1,.01,.6),warp=.025)
    lathe(g,'brass-samovar',[(0,0),(.19,.0),(.10,.06),(.13,.14),(.23,.20),(.25,.47),(.19,.56),(.12,.59),(.10,.64)],m['brass'],vessels,centre=(1.18,.02,.32))
    for side in [-1,1]:add_sweep(g,'samovar-handle-'+str(side),[[1.18+side*.2,.46,.32],[1.18+side*.33,.47,.32],[1.18+side*.34,.32,.32],[1.18+side*.23,.30,.32]],m['brass'],vessels,w=.023)
    add_sweep(g,'samovar-tap',[[1.18,.22,.52],[1.18,.22,.64],[1.18,.16,.66]],m['brass'],vessels,w=.025)
    person(g,m,'host',(-1.25,0,-.25),gender='female',yaw=math.pi/2)
    person(g,m,'guest',(1.2,0,-.75),yaw=-math.pi/2)
    return g.write(0)

def tusaukeser():
    g=GLB('tusaukeser');m=mats(g);ground(g,m,2.65)
    cloth(g,'aq-zhol',lambda u,v:[-.43+u*.86,.025+.005*math.sin(v*45+u*3),-1.6+v*3.3],m['linen'],rows=60,cols=16)
    child,bones,h=person(g,m,'toddler',(0,0,-.6),age='baby')
    elder,eb,_=person(g,m,'ceremony-elder',(.7,0,-.85),pose='working',yaw=-math.pi/2)
    person(g,m,'supporting-parent',(-.76,0,-.83),gender='female',pose='working',yaw=math.pi/2)
    # A real two-strand black/white braided cord, around ankles and with tied ends.
    rope=g.node('ala-zhip',extras={'hotspot':'ala-zhip'})
    for strand in range(2):
        path=[]
        for t in np.linspace(0,TAU,220):
            angle=t+strand*math.pi;path.append([.10*math.cos(t)+.004*math.cos(t*32+angle),.11+.004*math.sin(t*32+angle),-.60+.067*math.sin(t)])
        add_sweep(g,f'braided-strand-{strand}',path,m['black'] if strand==0 else m['white'],rope,w=.006)
    for side in [-1,1]:
        for strand in range(2):
            add_sweep(g,f'cord-tail-{side}-{strand}',[[side*.08+.004*math.sin(t*30+strand*math.pi),.11-t*.07,-.54+t*.08] for t in np.linspace(0,1,80)],m['black'] if strand==0 else m['white'],rope,w=.005)
    scissors=g.node('ceremony-scissors',extras={'hotspot':'scissors'})
    for side in [-1,1]:
        blade=g.node('scissor-blade-'+str(side),scissors,pos=(.13,.14,-.59))
        add_sweep(g,'scissor-steel-'+str(side),[[0,0,0],[side*.015,0,-.15]],m['silver'],blade,w=.018,h=.005)
        path=[[side*.036+math.cos(t)*.03,0,.041+math.sin(t)*.046] for t in np.linspace(0,TAU,40)]
        add_sweep(g,'scissor-loop-'+str(side),path,m['silver'],blade,w=.008)
        g.track(blade,'rotation',[0,4,5.3,6,7,12],[quat([0,1,0],a*side) for a in [.3,.3,.38,.03,.15,.15]],'VEC4')
    # Preparation, cut/fall, first steps: baked glTF skeletal and object animation.
    g.track(rope,'translation',[0,4,6,7.5,12],[[0,0,0],[0,0,0],[0,0,0],[.17,-.08,.13],[.17,-.08,.13]],'VEC3')
    g.track(rope,'scale',[0,6,12],[[1,1,1],[.00001]*3,[.00001]*3],'VEC3','STEP')
    cut=g.node('cut-ala-zhip',extras={'hotspot':'ala-zhip'})
    g.doc['nodes'][cut]['scale']=[.00001]*3
    for half in range(2):
        for strand in range(2):
            path=[]
            for t in np.linspace(half*math.pi+.04,(half+1)*math.pi-.04,120):
                path.append([.10*math.cos(t)+.004*math.cos(t*32+strand*math.pi),.11+.004*math.sin(t*32+strand*math.pi),-.60+.067*math.sin(t)])
            add_sweep(g,f'open-cut-cord-{half}-{strand}',path,m['black'] if strand==0 else m['white'],cut,w=.006)
    g.track(cut,'scale',[0,6,12],[[.00001]*3,[1]*3,[1]*3],'VEC3','STEP')
    g.track(cut,'translation',[0,6,7.5,12],[[0,0,0],[0,0,0],[.17,-.08,.13],[.17,-.08,.13]],'VEC3')
    g.track(child,'translation',[0,8,9,10,11,12],[[0,0,-.6],[0,0,-.6],[0,.012,-.37],[0,0,-.12],[0,.012,.15],[0,0,.40]],'VEC3')
    for side,sign in [('l',1),('r',-1)]:
        g.track(bones['thigh_'+side],'rotation',[0,8,9,10,11,12],[quat([1,0,0],a*sign) for a in [0,0,.20,-.20,.20,0]],'VEC4')
        g.track(bones['calf_'+side],'rotation',[0,8,9,10,11,12],[quat([1,0,0],a) for a in [0,0,.12,0,.12,0]],'VEC4')
    g.track(eb['lowerarm_r'],'rotation',[0,4,6,8,12],[quat([1,0,0],a) for a in [-.5,-.7,-1.2,-.5,-.5]],'VEC4')
    return g.write(12)

if __name__=='__main__':
    manifest=[]
    for fn in [asar,nauryz,tusaukeser]:
        item=fn();manifest.append(item);print(json.dumps(item),flush=True)
    (OUT/'asset-stats.json').write_text(json.dumps(manifest,indent=2))
