"""Editable, deterministic mesh authoring source. Python 3 + numpy + Pillow.
No runtime primitives: swept bevelled timbers, sewn cloth surfaces, lathed vessels,
MPFB CC0 anatomical meshes with actual skeletal skinning. Units are metres.
The result is an authored reconstruction draft, NOT an ethnographic measurement.
"""
from pathlib import Path
from io import BytesIO
import gzip, hashlib, json, math, struct
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
    elif kind=='baked': height=.5+.14*np.sin(x*.041+np.sin(y*.031)*2)*np.sin(y*.057)+noise*.085
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
    if name=='rug':
        # Original paired-scroll design informed by documented qoshqarmuyiz
        # carpets; it is not traced from a collection object.
        draw=ImageDraw.Draw(image)
        relief=Image.new('L',(n,n)); relief_draw=ImageDraw.Draw(relief)
        for inset in [17,31,43]:
            draw.rectangle((inset,inset,n-inset,n-inset),outline=(115,34,37),width=5)
            relief_draw.rectangle((inset,inset,n-inset,n-inset),outline=158,width=5)
        for cx,cy in [(130,130),(382,130),(130,382),(382,382),(256,256)]:
            for sign in [-1,1]:
                points=[]
                for t in np.linspace(.25,math.pi*2.5,105):
                    radius=3+5*t
                    points.append((cx+sign*(17+radius*math.cos(t)),cy+radius*math.sin(t)))
                draw.line(points,fill=(131,43,42),width=7,joint='curve')
                relief_draw.line(points,fill=185,width=7,joint='curve')
        image=image.filter(ImageFilter.GaussianBlur(.35))
        height+=np.asarray(relief,dtype=float)/255*.035
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
    ('leather',(42,28,23),'felt'),('skin',(184,129,98),'felt'),('earth',(113,100,72),'soil'),
    ('baked',(195,125,47),'baked'),('rug',(207,196,170),'cloth')]}

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
        if joints is not None:
            joints=np.asarray(joints).copy();weights=np.asarray(weights)
            joints[weights<=1e-8]=0
            attr['JOINTS_0']=self.acc(joints,'VEC4',5123,34962)
            attr['WEIGHTS_0']=self.acc(weights,'VEC4',target=34962)
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
    # Reveal complete components. Scaling a finished frame or felt sheet through
    # intermediate sizes made the assembly look elastic and detached.
    if start > 0:g.track(node,'scale',[0,start,end],[[.00001]*3,[1]*3,[1]*3],'VEC3','STEP')

def mats(g):
    return {k:g.material(k,tex=k) for k in TEXTURES}|{'brass':g.material('brass',(0.73,.50,.21),rough=.28,metal=.85),'silver':g.material('silver',(.66,.69,.71),rough=.2,metal=.95),'black':g.material('black-wool',(.07,.065,.06)), 'white':g.material('white-wool',(.86,.84,.77)), 'blue':g.material('blue-cloth',(.19,.36,.52),tex='linen'), 'red':g.material('red-cloth',(.64,.2,.19),tex='linen'),'darkcloth':g.material('dark-cloth',(.16,.17,.18),tex='linen',rough=.92),'hair':g.material('hair',(.10,.07,.055),rough=.96),'food':g.material('baked-dough',(1,1,1),tex='baked',rough=.9),'kozhe':g.material('kozhe',(.81,.76,.62),rough=.44),'eye':g.material('dark-iris',(.045,.025,.015),rough=.27),'sclera':g.material('sclera',(.77,.74,.67),rough=.35)}

def ground(g,m,radius=3.9):
    # Raised irregular terrain patch, not an infinite primitive floor.
    lathe(g,'steppe-terrain',[(0,-.04),(radius,-.04),(radius,.0),(0,.0)],m['earth'],segments=160,warp=.005)

def yurt(g,m,parent=0,animated=False,cutaway=False):
    structure=g.node('yurt',parent,extras={'hotspot':'kerege'})
    wall=g.node('kerege',structure,extras={'hotspot':'kerege'});R=2.05;H=1.48
    sections=[g.node(f'kerege-section-{i}',wall) for i in range(6)]
    # Wooden lattice rails trace real cylindrical wall arcs; door opening at +Z.
    for k in range(72):
        for direction in [-1,1]:
            a0=k*TAU/72+.25
            path=[]
            for t in np.linspace(0,1,9):
                a=a0+direction*(t-.5)*.32
                if abs(math.atan2(math.sin(a),math.cos(a)))<(.90 if cutaway else .20):break
                path.append([R*math.sin(a),.05+t*H,R*math.cos(a)])
            if len(path)>1:add_sweep(g,f'kerege-rail-{k}-{direction}',path,m['wood'],sections[k//12],w=.022,h=.035)
    # Rawhide lashings at lattice crossings, explicitly modelled knotted bands.
    for k in range(66):
        a=.27+k*(TAU-.54)/66
        if cutaway and abs(math.atan2(math.sin(a),math.cos(a)))<.90:continue
        for y in [.27,.63,.99,1.35]:
            centre=np.array([R*math.sin(a),y,R*math.cos(a)])
            path=[centre+np.array([math.cos(a)*math.cos(t)*.02,math.sin(t)*.034,-math.sin(a)*math.cos(t)*.02]) for t in np.linspace(0,TAU,13)]
            add_sweep(g,f'rawhide-binding-{k}-{y}',path,m['leather'],sections[min(k//11,5)],w=.005)
    door=g.node('sykyrlauyq',wall,extras={'hotspot':'door'})
    for x in [-.41,.41]:add_sweep(g,f'door-post-{x}',[[x,0,R],[x,H+.06,R]],m['wood'],door,w=.085,h=.07)
    for y in [.04,H+.04]:add_sweep(g,f'door-crossbeam-{y}',[[-.45,y,R],[.45,y,R]],m['wood'],door,w=.085,h=.085)
    # Inset framed door leaves with geometric carved relief.
    for side in [-1,1]:
        x=.20*side
        # Four fitted boards sit behind each framed leaf; a bare outline read as
        # an unfinished gate rather than a wooden sykyrlauyq.
        for board in range(4):
            bx=x-.12+board*.08
            add_sweep(g,f'leaf-board-{side}-{board}',[[bx,.17,R+.004],[bx,1.35,R+.004]],m['wood'],door,w=.078,h=.022)
        for xx in [-.16,.16]:add_sweep(g,f'leaf-upright-{side}-{xx}',[[x+xx,.12,R+.02],[x+xx,1.4,R+.02]],m['wood'],door,w=.046,h=.034)
        for yy in [.16,.6,1.06,1.39]:add_sweep(g,f'leaf-rail-{side}-{yy}',[[x-.16,yy,R+.02],[x+.16,yy,R+.02]],m['wood'],door,w=.035,h=.032)
        for yy in [.37,.82,1.23]:
            add_sweep(g,f'leaf-carving-{side}-{yy}',[[x,yy-.14,R+.035],[x+.11,yy,R+.045],[x,yy+.14,R+.035],[x-.11,yy,R+.045],[x,yy-.14,R+.035]],m['brass'],door,w=.009)
        for yy in [.27,1.22]:
            add_sweep(g,f'door-hinge-strap-{side}-{yy}',[[x+side*.15,yy,R+.05],[x+side*.02,yy,R+.05]],m['black'],door,w=.018,h=.008)
    if cutaway:g.doc['nodes'][door]['scale']=[.00001]*3
    lift=g.node('shanyraq-lift',structure)
    crown=g.node('shanyraq',lift,pos=(0,2.55,0),extras={'hotspot':'shanyraq'})
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
    supports=g.node('bakan',lift,extras={'hotspot':'bakan'})
    add_sweep(g,'forked-support-shaft',[[.10,.0,-.03],[.06,2.46,-.03]],m['wood'],supports,w=.055,h=.047)
    for side in [-1,1]:add_sweep(g,f'fork-{side}',[[.06,2.31,-.03],[side*.15,2.54,-.03]],m['wood'],supports,w=.026)
    if not animated:g.doc['nodes'][supports]['scale']=[.00001]*3
    poles=g.node('uyk',structure,extras={'hotspot':'uyk'})
    for k in range(64):
        a=.24+k*(TAU-.48)/63;path=[]
        anchor=np.array([R*math.sin(a),H+.05,R*math.cos(a)])
        for t in np.linspace(0,1,22):
            r=R*(1-t)+.53*t;y=H+.05+1.02*(t**.72)
            path.append((np.array([r*math.sin(a),y,r*math.cos(a)])-anchor).tolist())
        p=g.node(f'uyk-hinge-{k}',poles,pos=anchor.tolist())
        add_sweep(g,f'curved-uyk-{k}',path,m['wood'],p,w=.023,h=.033)
        if animated:
            st=8+(k/64)*2.7
            stage_visibility(g,p,st)
            axis=[math.cos(a),0,-math.sin(a)]
            g.track(p,'rotation',[0,st,st+.85,16],[quat(axis,-1.45),quat(axis,-1.45),quat(axis,0),quat(axis,0)],'VEC4')
    felt=g.node('kiiz',structure,extras={'hotspot':'kiiz'})
    # Open entry; Nauryz cutaway deliberately exposes interior for study.
    amin=.24 if not cutaway else .90;amax=TAU-.24 if not cutaway else TAU-.90
    for panel in range(8):
        a0=amin+(amax-amin)*panel/8;a1=amin+(amax-amin)*(panel+1)/8
        piece=g.node(f'felt-set-{panel}',felt)
        def wall_fn(u,v,a0=a0,a1=a1):
            a=a0+(a1-a0)*u;r=R+.038+.009*math.sin(v*21+u*4)+.004*math.sin(u*65)
            return [r*math.sin(a),.035+v*(H+.05),r*math.cos(a)]
        cloth(g,f'tuyrlyq-panel-{panel}',wall_fn,m['felt'],piece,rows=18,cols=18)
        for edge_u in [0,1]:
            edge=[wall_fn(edge_u,t) for t in np.linspace(0,1,20)]
            add_sweep(g,f'felt-wall-edge-{panel}-{edge_u}',edge,m['felt'],piece,w=.024,h=.022)
        for edge_v in [0,1]:
            edge=[wall_fn(t,edge_v) for t in np.linspace(0,1,28)]
            add_sweep(g,f'felt-wall-hem-{panel}-{edge_v}',edge,m['linen'],piece,w=.012,h=.012)
        ra0=(0 if not cutaway else amin)+(TAU if not cutaway else amax-amin)*panel/8
        ra1=(0 if not cutaway else amin)+(TAU if not cutaway else amax-amin)*(panel+1)/8
        def roof_fn(u,v,a0=ra0,a1=ra1):
            a=a0+(a1-a0)*u;r=.59+(R-.59)*v
            rise=(R-r)/(R-.53)
            y=H+.095+1.02*(rise**.72)+.006*math.sin(u*38+v*6)
            return [r*math.sin(a),y,r*math.cos(a)]
        cloth(g,f'uzik-panel-{panel}',roof_fn,m['felt'],piece,rows=22,cols=18)
        for edge_u in [0,1]:
            edge=[roof_fn(edge_u,t) for t in np.linspace(0,1,24)]
            add_sweep(g,f'felt-roof-edge-{panel}-{edge_u}',edge,m['felt'],piece,w=.024,h=.022)
        if animated:stage_visibility(g,piece,12.1+panel*.34)
    cloth(g,'basqur-woven-belt',lambda u,v:[(R+.052)*math.sin(amin+(amax-amin)*u),1.27+v*.15,(R+.052)*math.cos(amin+(amax-amin)*u)],m['ornament'],felt,rows=3,cols=128)
    # Tundik is folded back; smoke/light opening remains legible.
    cloth(g,'folded-tundik',lambda u,v:[-.55+u*1.1,2.62-1.05*(max(0,math.hypot(-.55+u*1.1,-.9+v*.5)-.59)/(R-.59))**1.26+.009*math.sin(v*math.pi*5),-.9+v*.5],m['felt'],felt,rows=18,cols=32)
    for y in [.58,1.13]:
        add_sweep(g,f'outer-lashing-{y}',[[(R+.065)*math.sin(a),y,(R+.065)*math.cos(a)] for a in np.linspace(amin,amax,160)],m['leather'],felt,w=.018)
    if animated:
        for sec,panel in enumerate(sections):
            a=(sec+.5)*TAU/6
            offset=[.48*math.sin(a),0,.48*math.cos(a)]
            g.track(panel,'translation',[0,.3+sec*.25,3.3,16],[offset,offset,[0,0,0],[0,0,0]],'VEC3')
        # The crown rests in the fork throughout the lift. A single pivot at
        # ground level keeps the long bakan and shanyraq in contact.
        g.track(lift,'rotation',[0,4,7.5,16],[quat([1,0,0],-math.pi/2),quat([1,0,0],-math.pi/2),quat([1,0,0],0),quat([1,0,0],0)],'VEC4')
        g.track(supports,'scale',[0,15,16],[[1]*3,[.00001]*3,[.00001]*3],'VEC3','STEP')
        for child in g.doc['nodes'][felt].get('children',[]):
            if not g.doc['nodes'][child]['name'].startswith('felt-set-'):
                stage_visibility(g,child,14.75)
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

def quat_mul(a,b):
    ax,ay,az,aw=a;bx,by,bz,bw=b
    return [aw*bx+ax*bw+ay*bz-az*by,
            aw*by+ay*bw+az*bx-ax*bz,
            aw*bz+az*bw+ax*by-ay*bx,
            aw*bw-ax*bx-ay*by-az*bz]

def person(g,m,name,position,gender='male',age='young',pose='relaxed',yaw=0,animated=False,stature=None):
    p=BASE.copy();target=VENDOR/f'asian-{gender}-{age}.target.gz'
    with gzip.open(target,'rt') as stream:
        for l in stream:
            s=l.split()
            if len(s)==4 and not s[0].startswith('#'):p[int(s[0])]+=np.array([float(x) for x in s[1:]])
    # Preserve MPFB's sculpted facial topology and individual fingers. Small
    # stable morphs change facial breadth and jaw shape without added primitives.
    identity=int.from_bytes(hashlib.sha256(name.encode()).digest()[:4],'little')
    elder=any(word in name for word in ['elder','senior','grandmother','grandfather'])
    upper=p[:13380,1].max();lower=p[:13380,1].min();span=upper-lower
    facial=(p[:,1]>upper-span*.18)&(np.abs(p[:,0])<span*.09)
    jaw=(p[:,1]>upper-span*.18)&(p[:,1]<upper-span*.115)&(np.abs(p[:,0])<span*.085)
    p[facial,0]*=1+(((identity%9)-4)*.009)
    p[jaw,0]*=1+((((identity//9)%9)-4)*.008)
    if elder:
        cheek=facial&(p[:,1]<upper-span*.085)&(p[:,1]>upper-span*.145)&(p[:,2]>span*.040)
        p[cheek,1]-=span*.0025
    height=stature if stature is not None else (.82 if age=='baby' else (1.65 if gender=='female' else 1.76))
    bottom=p[:13380,1].min();factor=height/(p[:13380,1].max()-bottom);p[:,1]-=bottom;p*=factor
    root=g.node(name,pos=position,extras={'hotspot':'community','anatomy':'MPFB CC0 exposed face and hands; separately tailored garments'})
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
    palette=([(0.50,.14,.18),(.35,.18,.27),(.21,.34,.32),(.48,.29,.15)] if gender=='female'
             else [(.16,.31,.44),(.25,.28,.39),(.31,.30,.24),(.20,.37,.36)])
    garment_colour=palette[(identity//13)%len(palette)]
    if name=='bride':garment_colour=(.58,.18,.21)
    fabric=g.material(name+'-tailored-fabric',garment_colour,tex='linen',rough=.93)
    # The MPFB body is an anatomy source, never the finished garment. Covered
    # torso and arm faces are omitted; independent cloth panels cover them.
    buckets={};lookup={};verts={};uvs={};joints={};weights={}
    dominant=np.argmax(JW,axis=1)
    def category(vi):
        b=BONES[dominant[vi]]
        if b in ['head','neck_01'] or 'hand' in b or any(k in b for k in ['thumb','index','middle','ring','pinky']):return 'skin'
        if any(k in b for k in ['ball','foot']):return 'leather'
        if 'lowerarm_' in b and np.linalg.norm(p[vi]-heads[BONES.index('hand_'+b[-1])])<.065:return 'ornament'
        if any(k in b for k in ['thigh','calf']):return 'blue'
        return 'outfit'
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
    tone=.93+(identity%9)*.008
    skin_mat=g.material(name+'-skin',(tone,1-.012*((identity//11)%3),.98),tex='skin',rough=.91)
    for cat in buckets:
        if cat in ['outfit','blue']:continue
        g.mesh(name+'-'+cat,verts[cat],buckets[cat],skin_mat if cat=='skin' else fabric if cat=='outfit' else m[cat],root,uvs[cat],joints[cat],weights[cat],skin)
    # Follow the actual anatomical scalp topology to give each adult a hairline.
    # A small normal offset prevents z-fighting with the skin below.
    if age!='baby':
        hv=[];hf=[];hu=[];hj=[];hw=[];hlookup={}
        for grp,corners in OBJ:
            if grp!='body' or not all(p[vi,1]>height*.935 and p[vi,2]<height*.072 for vi,_ in corners):continue
            tri=[]
            for vi,ui in corners:
                if (vi,ui) not in hlookup:
                    hlookup[vi,ui]=len(hv);q=p[vi].copy();q[0]*=1.018;q[2]=q[2]*1.02-.003;q[1]+=.002
                    hv.append(q);hu.append(UV[ui]);hj.append([BONES.index('head'),0,0,0]);hw.append([1,0,0,0])
                tri.append(hlookup[vi,ui])
            for k in range(1,len(tri)-1):hf.append((tri[0],tri[k],tri[k+1]))
        hair=g.material(name+'-hair',(.31,.29,.27) if elder else (.10,.07,.055),rough=.96)
        if hf:g.mesh(name+'-anatomical-hairline',hv,hf,hair,root,hu,hj,hw,skin)
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
    def skinned_rail(label,path,mat,bone,w=.008):
        v,f,u=sweep(path,w,w)
        g.mesh(name+'-'+label,v,f,mat,root,u,[[bone,0,0,0]]*len(v),[[1,0,0,0]]*len(v),skin)
    # Patterned bodice: an elliptical, tapered cloth loft with shoulder slope,
    # ease over the bust and a small finished neck opening. There is deliberately
    # no breast or abdominal anatomy in this surface.
    if age!='baby':
        is_bride=name=='bride'
        shirt=g.material(name+'-linen-underdress',(.77,.72,.62) if gender=='female' else (.55,.60,.58),tex='linen',rough=.98)
        outer=g.material(name+'-velvet-kamzol' if gender=='female' else name+'-wool-shapan',
                         garment_colour,tex='linen',rough=.98)
        cuffmat=g.material(name+'-woven-edge',(.34,.21,.15),tex='linen',rough=.96)
        def bodice_shape(t,a,ease=0):
            # t is measured from waist to neckline. Shoulder width peaks just
            # below the neck instead of following the anatomical chest.
            y=height*(.50+.365*t)
            sections=[(0,.099,.089),(.34,.103,.096),(.65,.111,.100),(.78,.120,.098),(.90,.101,.083),(1,.050,.057)]
            for k in range(len(sections)-1):
                if t<=sections[k+1][0]:
                    lo,rx0,rz0=sections[k];hi,rx1,rz1=sections[k+1]
                    q=(t-lo)/(hi-lo);rx=rx0+(rx1-rx0)*q;rz=rz0+(rz1-rz0)*q;break
            fold=.0028*math.cos(10*a+5*t)*math.sin(math.pi*t)
            return [(rx+ease+fold)*height*math.cos(a),y,
                    height*.014+(rz+ease+fold)*height*math.sin(a)]
        bv,bf,bu=grid(32,80,lambda u,v:bodice_shape(v,u*TAU))
        bj=[];bw=[]
        for xyz in bv:
            blend=max(0,min(1,(xyz[1]/height-.50)/.13))
            bj.append([chest,pelvis,0,0]);bw.append([blend,1-blend,0,0])
        g.mesh(name+'-tailored-underdress-bodice',bv,bf,shirt,root,bu,bj,bw,skin)
        skinned_rail('bound-neckline',[bodice_shape(1,t) for t in np.linspace(0,TAU,97)],cuffmat,chest,w=.008)
        # Two articulated sleeve sections overlap at the elbow. Their axes
        # follow the rig's rest joints, so cuffs remain connected in motion.
        for side in ['l','r']:
            shoulder=heads[BONES.index('upperarm_'+side)];elbow=heads[BONES.index('lowerarm_'+side)]
            wrist=heads[BONES.index('hand_'+side)]
            for section,start,end,bone,r0,r1 in [('upper',shoulder,elbow,BONES.index('upperarm_'+side),.052,.045),
                                                  ('lower',elbow,wrist,BONES.index('lowerarm_'+side),.047,.035)]:
                axis=end-start;axis/=np.linalg.norm(axis)
                radial=np.cross(axis,[0,0,1]);radial/=np.linalg.norm(radial)
                forward=np.cross(axis,radial)
                def sleeve(u,v,start=start,end=end,radial=radial,forward=forward,r0=r0,r1=r1):
                    centre=start*(1-v)+end*v
                    radius=height*(r0*(1-v)+r1*v)
                    radius*=1+.035*math.cos(u*TAU*8+v*11)
                    return centre+radius*(math.cos(u*TAU)*radial+math.sin(u*TAU)*forward)
                sv,sf,su=grid(18,32,sleeve)
                g.mesh(name+'-'+section+'-cut-sleeve-'+side,sv,sf,outer if gender=='male' else shirt,root,su,
                       [[bone,0,0,0]]*len(sv),[[1,0,0,0]]*len(sv),skin)
                if section=='lower':
                    skinned_rail('embroidered-cuff-'+side,
                                 [sleeve(t,1) for t in np.linspace(0,1,41)],cuffmat,bone,w=.009)
        if gender=='male':
            trouser=g.material(name+'-cut-wool-trousers',(.22,.28,.32),tex='linen',rough=.98)
            for side in ['l','r']:
                hip=heads[BONES.index('thigh_'+side)]
                knee=heads[BONES.index('calf_'+side)]
                ankle=heads[BONES.index('foot_'+side)]
                for section,start,end,bone,r0,r1 in [('thigh',hip,knee,BONES.index('thigh_'+side),.054,.049),
                                                     ('calf',knee,ankle,BONES.index('calf_'+side),.052,.036)]:
                    axis=end-start;axis/=np.linalg.norm(axis)
                    radial=np.cross(axis,[0,0,1]);radial/=np.linalg.norm(radial)
                    forward=np.cross(axis,radial)
                    def trouser_leg(u,v,start=start,end=end,radial=radial,forward=forward,r0=r0,r1=r1):
                        centre=start*(1-v)+end*v
                        radius=height*(r0*(1-v)+r1*v)*(1+.025*math.cos(u*TAU*7+v*5))
                        return centre+radius*(math.cos(u*TAU)*radial+math.sin(u*TAU)*forward)
                    tv,tf,tu=grid(14,32,trouser_leg)
                    g.mesh(name+'-'+section+'-tailored-trouser-'+side,tv,tf,trouser,root,tu,
                           [[bone,0,0,0]]*len(tv),[[1,0,0,0]]*len(tv),skin)
    else:
        # A child's anatomical body is also hidden. The toddler and infant get
        # a simple woven tunic and loose leggings under their scene props.
        babycloth=g.material(name+'-woven-child-tunic',(.53,.61,.66),tex='linen',rough=.98)
        babytrouser=g.material(name+'-woven-child-leggings',(.27,.37,.43),tex='linen',rough=.98)
        def child_bodice(u,v):
            a=u*TAU;y=height*(.37+.50*v)
            rx=height*(.104+.014*math.sin(v*math.pi))*(1-.42*max(0,(v-.82)/.18))
            rz=height*(.091+.008*math.sin(v*math.pi))*(1-.38*max(0,(v-.82)/.18))
            return [rx*math.cos(a),y,height*.012+rz*math.sin(a)]
        cv,cf,cu=grid(22,48,child_bodice)
        g.mesh(name+'-separate-child-tunic',cv,cf,babycloth,root,cu,
               [[chest,0,0,0]]*len(cv),[[1,0,0,0]]*len(cv),skin)
        for side in ['l','r']:
            for part,start,end,bone,radius,mat in [
                ('upper-sleeve',heads[BONES.index('upperarm_'+side)],heads[BONES.index('lowerarm_'+side)],BONES.index('upperarm_'+side),.052,babycloth),
                ('lower-sleeve',heads[BONES.index('lowerarm_'+side)],heads[BONES.index('hand_'+side)],BONES.index('lowerarm_'+side),.043,babycloth),
                ('upper-legging',heads[BONES.index('thigh_'+side)],heads[BONES.index('calf_'+side)],BONES.index('thigh_'+side),.058,babytrouser),
                ('lower-legging',heads[BONES.index('calf_'+side)],heads[BONES.index('foot_'+side)],BONES.index('calf_'+side),.047,babytrouser)]:
                axis=end-start;axis/=np.linalg.norm(axis)
                radial=np.cross(axis,[0,0,1]);radial/=np.linalg.norm(radial)
                forward=np.cross(axis,radial)
                def child_tube(u,v,start=start,end=end,radial=radial,forward=forward,radius=radius):
                    centre=start*(1-v)+end*v
                    r=height*radius*(1-.12*v)
                    return centre+r*(math.cos(u*TAU)*radial+math.sin(u*TAU)*forward)
                tv,tf,tu=grid(12,24,child_tube)
                g.mesh(name+'-'+part+'-'+side,tv,tf,mat,root,tu,
                       [[bone,0,0,0]]*len(tv),[[1,0,0,0]]*len(tv),skin)
    if age!='baby':
        # Distinct upper garment. The women's kamzol is sleeveless with a
        # narrow open front; the men's shapan has wider overlapping fronts.
        outer_bottom=.13
        outer_top=.95 if gender=='female' else .93
        open_angle=.20 if gender=='female' else .14
        def coat_upper(u,v):
            t=outer_bottom+(outer_top-outer_bottom)*v
            a=math.pi/2+open_angle+u*(TAU-2*open_angle)
            return bodice_shape(t,a,.012 if gender=='female' else .025)
        ov,of,ou=grid(22,80,coat_upper)
        oj=[];ow=[]
        for xyz in ov:
            blend=max(0,min(1,(xyz[1]/height-.53)/.12))
            oj.append([chest,pelvis,0,0]);ow.append([blend,1-blend,0,0])
        g.mesh(name+'-separate-'+('kamzol' if gender=='female' else 'shapan')+'-upper',ov,of,outer,root,ou,oj,ow,skin)
        for edge in [0,1]:
            skinned_rail('outer-front-binding-'+str(edge),[coat_upper(edge,t) for t in np.linspace(0,1,35)],
                         cuffmat,chest,w=.009)
        skinned_rail('outer-neck-binding',[coat_upper(t,1) for t in np.linspace(0,1,81)],
                     cuffmat,chest,w=.008)
        if gender=='female':
            # A separate fastening, stitched rather than a painted repeat.
            for level in [.18,.38,.58]:
                for side in [-1,1]:
                    pt=coat_upper(0 if side==1 else 1,level)
                    skinned_rail('kamzol-fastener-'+str(side)+'-'+str(level),
                                 [pt,np.asarray(pt)+[side*.022,0,.004]],m['brass'],chest,w=.004)
    # The open kamzol must reveal another complete dress, not an empty torso.
    if age!='baby' and gender=='female' and name!='bride':
        def under_skirt(u,v):
            a=u*TAU;flare=(1-v)**1.5
            rx=height*(.083+.060*flare);rz=height*(.075+.052*flare)
            ripple=height*.0028*math.cos(12*a+v*3)*flare
            return [(rx+ripple)*math.sin(a),height*(.085+.47*v),(rz+ripple)*math.cos(a)]
        sv,sf,su=grid(32,80,under_skirt)
        g.mesh(name+'-complete-under-dress-skirt',sv,sf,shirt,root,su,
               [[pelvis,0,0,0]]*len(sv),[[1,0,0,0]]*len(sv),skin)
    # The lower skirt or shapan is a separate, flared pattern piece.
    if age!='baby' and name!='bride':
        coat=fabric
        def coat_shell(u,v):
            a=.19+u*(TAU-.38)
            y=height*((.09+.46*v) if gender=='female' else (.27+.28*v))
            flare=(1-v)**1.7
            rx=height*(.105+(.09 if gender=='female' else .083)*flare)
            rz=height*(.086+(.075 if gender=='female' else .066)*flare)
            fold=height*.005*math.sin(a*12+v*2.7)*flare
            return [(rx+fold)*math.sin(a),y,(rz+fold)*math.cos(a)]
        v,f,u=grid(28,80,coat_shell)
        js=[];ws=[]
        for vertex in v:
            blend=max(0,min(1,(vertex[1]/height-.48)/.08))
            js.append([chest,pelvis,0,0]);ws.append([blend,1-blend,0,0])
        g.mesh(name+'-tailored-open-chapan',v,f,coat,root,u,js,ws,skin)
        for side,edge_u in [('left',0),('right',1)]:
            skinned_rail('front-seam-'+side,[coat_shell(edge_u,t) for t in np.linspace(0,1,40)],m['darkcloth'],chest,w=.006)
        for level in [.025,.055]:
            skinned_rail('stitched-lower-hem-'+str(level),[coat_shell(t,level) for t in np.linspace(0,1,100)],m['ornament'],pelvis,w=.004)
    # Cap or practical headscarf. The latter is not ceremonial bridal dress.
    top=p[:13380,1].max();cz=np.median(p[:13380][p[:13380,1]>top-height*.05,2]);hatR=height*.060
    if name=='bride':
        pass  # Betashar supplies the ceremonial headdress and its own veil.
    elif gender=='female' and age!='baby':
        skinned_surface('working-headscarf',lambda u,v:[hatR*1.12*math.cos(v*math.pi/2)*math.cos(u*TAU),top-height*.032+height*.045*math.sin(v*math.pi/2),cz+hatR*1.12*math.cos(v*math.pi/2)*math.sin(u*TAU)],m['linen'],headidx,rows=16)
        for side in [-1,1]:
            skinned_surface('headscarf-tail-'+str(side),lambda u,v,side=side:[side*height*(.055+.025*u),top-height*(.045+.20*v),cz-height*(.012+.013*u)+.006*math.sin(v*15)],m['linen'],headidx,rows=25,cols=8)
    else:
        skinned_surface('taqiya',lambda u,v:[hatR*math.cos(v*math.pi/2)*math.cos(u*TAU),top-height*.035+height*.045*math.sin(v*math.pi/2),cz+hatR*math.cos(v*math.pi/2)*math.sin(u*TAU)],m['darkcloth'],headidx,rows=16)
        skinned_surface('taqiya-band',lambda u,v:[hatR*math.cos(u*TAU),top-height*.045+height*.024*v,cz+hatR*math.sin(u*TAU)],m['ornament'],headidx,rows=4)
    for grp in ['helper-l-eye','helper-r-eye']:
        eye=p[list(GROUPS[grp])].mean(axis=0)
        skinned_rail('eyebrow-'+grp,[[eye[0]+(t-.5)*height*.043,eye[1]+height*(.014+.003*math.cos(t*math.pi)),eye[2]+height*.008] for t in np.linspace(0,1,15)],m['hair'],headidx,w=.004)
    # Sash and paired embroidered front lapels.
    if name!='bride':
        skinned_surface('woven-sash',lambda u,v:[height*.108*math.cos(u*TAU),height*(.535+.018*v),height*.092*math.sin(u*TAU)],m['darkcloth'],pelvis,rows=3)
        for side in [-1,1]:
            skinned_surface('lapel-'+str(side),lambda u,v,side=side:[side*height*(.015+.062*v)+height*.012*u,height*(.55+.27*v),height*(.118-.019*v)],m['darkcloth'],chest,rows=20,cols=4)
    # Skeletal poses. Character hand positions still require manual artist review.
    for side,sign in [('l',1),('r',-1)]:
        angle=(-.40 if pose=='relaxed' else -.72)*sign
        g.doc['nodes'][bn['upperarm_'+side]]['rotation']=quat([0,0,1],angle)
        g.doc['nodes'][bn['lowerarm_'+side]]['rotation']=(
            quat_mul(quat([0,0,1],-1.0*sign),quat([1,0,0],-.35))
            if pose=='relaxed' else quat([1,0,0],-.65))
        # The source hand is an open anatomical rest hand. Curl finger joints
        # around the palm axis for a relaxed adult gesture; the musician curls
        # farther to touch the strings and neck rather than pointing rigidly.
        if age!='baby':
            curl=.65 if name=='akyn' else .24
            for digit in ['index','middle','ring','pinky']:
                for joint,amount in [('01',curl*.55),('02',curl),('03',curl*.55)]:
                    g.doc['nodes'][bn[f'{digit}_{joint}_{side}']]['rotation']=quat([1,0,0],amount)
            g.doc['nodes'][bn[f'thumb_02_{side}']]['rotation']=quat([1,0,0],curl*.28)
    if animated:
        for side,sign in [('l',1),('r',-1)]:
            values=[quat([0,0,1],a*sign) for a in [-.72,-.62,-.35,-.55,-.7,-.9]]
            g.track(bn['upperarm_'+side],'rotation',[0,4,6,8,12,16],values,'VEC4')
            g.track(bn['lowerarm_'+side],'rotation',[0,4,6,8,12,16],[quat([1,0,0],a) for a in [-.65,-.7,-1.05,-.9,-.7,-.3]],'VEC4')
    return root,bn,height

def asar():
    g=GLB('asar');m=mats(g);ground(g,m);yurt(g,m,animated=True)
    # At the lift endpoint the left hand reaches the bakan shaft near 1.13 m.
    person(g,m,'elder-helper',(.42,0,.20),pose='working',animated=True,yaw=math.pi)
    person(g,m,'west-helper',(-2.27,0,.15),pose='working',animated=True,yaw=math.pi/2)
    person(g,m,'east-helper',(2.22,0,-.25),gender='female',pose='working',animated=True,yaw=-math.pi/2)
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

def cushion(g,m,name,centre,mat):
    cx,cz=centre
    def surface(u,v,top=True):
        x=(u-.5)*.49;z=(v-.5)*.37
        puff=.045*math.sin(math.pi*u)*math.sin(math.pi*v)
        return [cx+x,.072+(puff if top else -.027),cz+z]
    cloth(g,name+'-top',lambda u,v:surface(u,v),mat,rows=12,cols=16)
    cloth(g,name+'-underside',lambda u,v:surface(u,v,False),mat,rows=5,cols=8)
    for side in [0,1]:
        cloth(g,name+f'-side-x{side}',lambda u,v,side=side:[cx+(side-.5)*.49,.045+.027*v,cz+(u-.5)*.37],mat,rows=3,cols=12)
        cloth(g,name+f'-side-z{side}',lambda u,v,side=side:[cx+(u-.5)*.49,.045+.027*v,cz+(side-.5)*.37],mat,rows=3,cols=12)
    border=[surface(t,0) for t in np.linspace(0,1,12)]+[surface(1,t) for t in np.linspace(0,1,9)]+[surface(t,1) for t in np.linspace(1,0,12)]+[surface(0,t) for t in np.linspace(1,0,9)]
    add_sweep(g,name+'-sewn-piping',border,m['darkcloth'],w=.008)

def nauryz():
    g=GLB('nauryz');m=mats(g);ground(g,m);yurt(g,m,cutaway=True)
    cloth(g,'tekemet',lambda u,v:[-1.8+u*3.6,.021+.003*math.sin(u*60)*math.sin(v*49),-1.7+v*3.2],m['ornament'],rows=32,cols=48)
    for i,centre in enumerate([(-1.14,-1.17),(1.14,-1.17),(-1.14,.96),(1.14,.96)]):
        cushion(g,m,f'woven-cushion-{i}',centre,m['red'] if i%2 else m['blue'])
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
