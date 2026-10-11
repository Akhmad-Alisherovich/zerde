"""Editable source for six contemporary Kazakh custom education scenes.

The scene designs are original interpretations, not measured artefact copies.
Run with ``python tools/modeling/build_additional_scenes.py [scene-id ...]``.
All dimensions are metres. Shared anatomical topology is CC0 MPFB data.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np

from build_scenes import GLB, add_sweep, bowl, bread, cloth, ground, lathe, mats, person, quat, stage_visibility, TAU


def runner(g, name, points, m, parent=0, width=.018, material='wood'):
    return add_sweep(g, name, points, m[material], parent, w=width)


def textile(g, name, x0, x1, z0, z1, y, mat, parent=0, sag=.008):
    return cloth(g, name,
                 lambda u, v: [x0+(x1-x0)*u,
                               y-sag*math.sin(math.pi*u)*math.sin(math.pi*v)+.003*math.sin(u*25+v*7),
                               z0+(z1-z0)*v],
                 mat, parent, rows=15, cols=22)


def room(g, m, radius=2.6):
    ground(g, m, radius)
    textile(g, 'woven-domestic-floor', -1.55, 1.55, -1.55, 1.55, .012, m['felt'], sag=0)
    # Three nested weave borders make the rug readable from above without
    # asserting a named ornamental pattern or a specific historic provenance.
    for k in range(3):
        d=1.50-k*.045
        runner(g, f'rug-edge-{k}', [[-d,.021,-d],[d,.021,-d],[d,.021,d],[-d,.021,d],[-d,.021,-d]],
               m, material='red' if k==1 else 'darkcloth', width=.012)


def cradle(g, m):
    cradle_root=g.node('besik', extras={'hotspot':'besik'})
    # Rocker pairs follow a curved sweep; four mortised uprights tie the
    # separate long rails and 11 fitted side slats into one wooden frame.
    for x in [-.42,.42]:
        runner(g, f'curved-rocker-{x}', [[x,.15+.10*(abs(z)/.72)**1.8,z] for z in np.linspace(-.72,.72,28)], m,
               cradle_root,.055)
        for z in [-.49,.49]:
            runner(g, f'besik-upright-{x}-{z}', [[x,.18,z],[x,.93,z]], m, cradle_root,.049)
        for y in [.47,.80]:
            runner(g, f'besik-side-rail-{x}-{y}', [[x,y,-.55],[x,y,.55]], m, cradle_root,.042)
        for z in np.linspace(-.43,.43,11):
            runner(g, f'besik-side-spindle-{x}-{z:.2f}', [[x,.47,z],[x,.80,z]], m, cradle_root,.018)
        # restrained carved diamond on each side, as an authored decorative
        # option rather than a claimed measured carving.
        runner(g, f'besik-side-relief-{x}', [[x*1.025,.48,-.16],[x*1.025,.60,0],
               [x*1.025,.48,.16]],m,cradle_root,.009,material='brass')
    for z in [-.52,.52]:
        for y in [.47,.80]:
            runner(g, f'besik-end-rail-{z}-{y}', [[-.45,y,z],[.45,y,z]],m,cradle_root,.045)
    for z in np.linspace(-.43,.43,13):
        runner(g, f'besik-bed-slat-{z:.2f}',[[-.41,.55,z],[.41,.55,z]],m,cradle_root,.025)
    bedding=g.node('besik-bedding',cradle_root,extras={'hotspot':'bedding'})
    textile(g,'besik-padded-mattress',-.38,.38,-.51,.51,.575,m['felt'],bedding)
    textile(g,'besik-linen-sheet',-.35,.35,-.49,.49,.595,m['linen'],bedding)
    # Soft folded border is independent geometry with finite thickness.
    for x in [-.35,.35]:
        runner(g,f'bedding-piped-side-{x}',[[x,.596,-.49],[x,.596,.49]],m,bedding,.012,'blue')
    for z in [-.49,.49]:
        runner(g,f'bedding-piped-end-{z}',[[-.35,.596,z],[.35,.596,z]],m,bedding,.012,'blue')
    # Head arch and suspended cloth are visible from every side.
    arch=g.node('besik-head-bow',cradle_root,extras={'hotspot':'arch'})
    for z in [-.30,-.21]:
        runner(g, f'besik-head-arch-{z}',[[x,.79+.41*math.sqrt(max(0,1-(x/.44)**2)),z]
               for x in np.linspace(-.44,.44,31)],m,arch,.025)
    veil=g.node('besik-cover',cradle_root,extras={'hotspot':'cover'})
    cloth(g,'besik-cover-textile',lambda u,v:[-.49+.98*u,
          .92+.30*math.sin(math.pi*u)-.10*v+.008*math.sin(16*v),-.30+.40*v],
          m['linen'],veil,rows=12,cols=40)
    stage_visibility(g,veil,8,12)
    return cradle_root


def besikke_salu():
    g=GLB('besikke-salu');m=mats(g);room(g,m)
    cradle(g,m)
    elder,eb,_=person(g,m,'senior-woman',(-1.25,0,.18),gender='female',pose='working',yaw=math.pi/2)
    parent,pb,_=person(g,m,'parent',(1.32,0,.12),gender='female',pose='working',yaw=-math.pi/2)
    # MPFB's baby morph is scaled to a newborn-sized 0.54 m and rotated into
    # a supported, supine orientation. No rigid cartoon infant proxy is used.
    infant,ib,_=person(g,m,'infant',(1.00,.94,.15),gender='male',age='baby',stature=.54)
    g.doc['nodes'][infant]['rotation']=quat([1,0,0],-math.pi/2)
    g.track(infant,'translation',[0,4,5.5,7.7,8,12],
            [[1,.94,.15],[1,.94,.15],[.53,.82,.14],[0,.66,.14],[0,.66,.14],[0,.66,.14]],'VEC3')
    # The elder follows the movement with small shoulder and elbow changes.
    for side,sgn in [('l',1),('r',-1)]:
        g.track(eb['upperarm_'+side],'rotation',[0,4,6,8,12],
                [quat([0,0,1],a*sgn) for a in [-.72,-.60,-.49,-.62,-.77]],'VEC4')
        g.track(pb['lowerarm_'+side],'rotation',[0,4,6,8,12],
                [quat([1,0,0],a) for a in [-.65,-.72,-.93,-.68,-.65]],'VEC4')
    # A wrap follows the baby only at the settled stage, preventing a cloth
    # surface from travelling detached through the cradle rails.
    wrap=g.node('infant-wrap',extras={'hotspot':'swaddle'})
    cloth(g,'folded-infant-wrap',lambda u,v:[-.19+.38*u,
          .755+.017*math.sin(math.pi*u),-.02+.36*v],m['blue'],wrap,rows=18,cols=24)
    stage_visibility(g,wrap,8,12)
    g.doc['nodes'][0]['extras'].update({'interpretation':'contemporary family gathering; unverified dress and dimensions',
                                        'culturalReview':'required'})
    return g.write(12)


def instrument(g,m):
    inst=g.node('dombyra',extras={'hotspot':'dombyra'})
    # Hollow pear-shaped corpus, soundboard edge, narrow neck, two strings and
    # discrete frets. A generic contemporary dombra, not a named maker's work.
    lathe(g,'dombyra-corpus',[(0,0),(.085,.02),(.165,.13),(.16,.27),(.10,.38),(.045,.43)],
          m['wood'],inst,centre=(1.06,.77,.22),segments=48)
    runner(g,'dombyra-neck',[[1.06,1.19,.22],[1.06,1.83,.22]],m,inst,.050)
    runner(g,'dombyra-head',[[1.06,1.83,.22],[1.09,1.95,.22]],m,inst,.078)
    for y in np.linspace(1.25,1.75,11):
        runner(g,f'dombyra-fret-{y:.2f}',[[1.03,y,.254],[1.09,y,.254]],m,inst,.004,'darkcloth')
    for side in [-1,1]:
        runner(g,f'dombyra-string-{side}',[[1.06+side*.012,.86,.384],
               [1.06+side*.012,1.85,.257]],m,inst,.0025,'silver')
    lathe(g,'dombyra-bridge',[(0,0),(.027,0),(.027,.013),(0,.013)],
          m['darkcloth'],inst,centre=(1.06,.92,.366),segments=16)
    return inst


def betashar():
    g=GLB('betashar');m=mats(g);room(g,m,3.3)
    bride,bb,_=person(g,m,'bride',(-.55,0,0),gender='female',pose='working')
    poet,pb,_=person(g,m,'akyn',(1.08,0,-.25),pose='working',yaw=-math.pi/3)
    person(g,m,'relative',(-1.67,0,-.48),gender='female',yaw=math.pi/3)
    dress=g.node('bridal-garment',extras={'hotspot':'dress'})
    cloth(g,'layered-wedding-skirt',lambda u,v:[-.55+(.43-.20*v)*math.cos(u*TAU),
          .18+1.0*v+.014*math.sin(u*TAU*13)*(1-v),(.40-.18*v)*math.sin(u*TAU)],
          m['red'],dress,rows=30,cols=96)
    for h in [.20,.28,.36]:
        runner(g,f'wedding-hem-{h}',[[-.55+(.43-.20*h)*math.cos(t),.18+h,
               (.40-.18*h)*math.sin(t)] for t in np.linspace(0,TAU,97)],m,dress,.009,'brass')
    headdress=g.node('bridal-headdress',extras={'hotspot':'headdress'})
    lathe(g,'bridal-conical-headpiece',[(0,0),(.125,0),(.118,.12),(.065,.38),(.015,.44)],
          m['red'],headdress,centre=(-.55,1.66,0),segments=48)
    for h,r in [(.03,.125),(.11,.118),(.29,.077)]:
        runner(g,f'headpiece-band-{h}',[[-.55+r*math.cos(t),1.66+h,r*math.sin(t)]
               for t in np.linspace(0,TAU,65)],m,headdress,.008,'brass')
    veilmat=g.material('translucent-bridal-veil',(0.95,.91,.82),tex='linen',rough=.9)
    g.doc['materials'][veilmat]['pbrMetallicRoughness']['baseColorFactor'][3]=.74
    g.doc['materials'][veilmat]['alphaMode']='BLEND'
    veil=g.node('bridal-veil',pos=(-.55,1.85,.08),extras={'hotspot':'veil'})
    cloth(g,'front-veil',lambda u,v:[(u-.5)*(.34+.12*v),
          -.46*v+.012*math.sin(u*TAU*3)*v,.15+.018*math.sin(math.pi*u)*v],
          veilmat,veil,rows=30,cols=30)
    cloth(g,'veil-reverse',lambda u,v:[(u-.5)*(.34+.12*v),
          -.46*v+.012*math.sin(u*TAU*3)*v,.145+.018*math.sin(math.pi*u)*v],
          veilmat,veil,rows=30,cols=30)
    g.track(veil,'rotation',[0,7.7,9,11.5,12],
            [quat([1,0,0],a) for a in [0,0,.7,1.55,1.55]],'VEC4')
    g.track(bb['head'],'rotation',[0,4,5.5,7.8,9,12],
            [quat([1,0,0],a) for a in [0,0,.17,.17,0,0]],'VEC4')
    g.track(bb['spine_03'],'rotation',[0,4,5.5,7.8,9,12],
            [quat([1,0,0],a) for a in [0,0,.10,.10,0,0]],'VEC4')
    for side in ['l','r']:
        g.track(pb['lowerarm_'+side],'rotation',[0,4,6,8,12],
                [quat([1,0,0],a) for a in [-.65,-.77,-.57,-.72,-.65]],'VEC4')
    instrument(g,m)
    return g.write(12)


def earring(g,m,name,centre,parent=0):
    node=g.node(name,parent,pos=centre,extras={'hotspot':'earrings'})
    runner(g,name+'-hoop',[[.028*math.cos(t),.028*math.sin(t),0]
           for t in np.linspace(0,TAU,33)],m,node,.006,'brass')
    runner(g,name+'-fastener',[[0,.028,0],[0,.040,-.013]],m,node,.004,'silver')
    runner(g,name+'-pendant',[[0,-.028,0],[0,-.075,0]],m,node,.007,'brass')
    lathe(g,name+'-drop',[(0,0),(.020,.010),(.012,.034),(0,.042)],
          m['brass'],node,centre=(0,-.108,0),segments=20)
    return node


def syrga_salu():
    g=GLB('syrga-salu');m=mats(g);room(g,m)
    person(g,m,'bride-to-be',(-.45,0,0),gender='female',pose='working')
    giver,gb,_=person(g,m,'senior-relative',(.95,0,.02),gender='female',pose='working',yaw=-math.pi/2)
    person(g,m,'family-witness',(-1.6,0,-.42),gender='male',yaw=math.pi/3)
    # The earring meshes have separate hoop, clasp and pendant components.
    left=earring(g,m,'left-earring',(-.56,1.48,.02))
    right=earring(g,m,'right-earring',(.80,1.06,.20))
    g.track(right,'translation',[0,4,5.8,7.9,8,12],
            [[.8,1.06,.2],[.8,1.06,.2],[.10,1.43,.13],[-.34,1.48,.02],
             [-.34,1.48,.02],[-.34,1.48,.02]],'VEC3')
    g.track(gb['upperarm_l'],'rotation',[0,4,6,8,12],
            [quat([0,0,1],a) for a in [-.72,-.61,-.28,-.35,-.70]],'VEC4')
    tray=g.node('earring-tray',extras={'hotspot':'tray'})
    lathe(g,'small-offering-tray',[(0,0),(.15,0),(.19,.025),(.18,.04),(.14,.028),(0,.018)],
          m['wood'],tray,centre=(.64,1.01,.22),segments=48)
    return g.write(12)


def low_table(g,m,hotspot='table'):
    table=g.node('low-dastarkhan',extras={'hotspot':hotspot})
    lathe(g,'wooden-table',[(0,.15),(.75,.15),(.77,.17),(.77,.21),(.70,.22),(0,.22)],
          m['wood'],table,segments=64)
    for a in np.linspace(0,TAU,4,endpoint=False):
        runner(g,'low-table-leg',[[.58*math.cos(a),.02,.58*math.sin(a)],
               [.58*math.cos(a),.17,.58*math.sin(a)]],m,table,.06)
    return table


def bata_beru():
    g=GLB('bata-beru');m=mats(g);room(g,m,3)
    low_table(g,m)
    elder,eb,_=person(g,m,'blessing-elder',(0,0,-1.08),pose='working')
    left,lb,_=person(g,m,'listener-left',(-1.35,0,.25),gender='female',yaw=math.pi/3)
    right,rb,_=person(g,m,'listener-right',(1.34,0,.26),yaw=-math.pi/3)
    for root,bones,(x,z) in [(elder,eb,(0,-1.08)),(left,lb,(-1.35,.25)),(right,rb,(1.34,.26))]:
        # Pelvis at approximately 0.45 m, knees forward and feet folded back
        # under an actual supported seat. MPFB skinning bends with 53 joints.
        g.doc['nodes'][root]['translation'][1]=-.48
        for side in ['l','r']:
            g.doc['nodes'][bones['thigh_'+side]]['rotation']=quat([1,0,0],-1.25)
            g.doc['nodes'][bones['calf_'+side]]['rotation']=quat([1,0,0],2.25)
        stool=g.node(f'low-seat-{x}',extras={'hotspot':'table'})
        lathe(g,'seat-cushion',[(0,.39),(.28,.39),(.30,.415),(.28,.45),(0,.45)],
              m['felt'],stool,centre=(x,0,z),segments=40)
        for dx in [-.18,.18]:
            for dz in [-.15,.15]:
                runner(g,'wooden-seat-leg',[[x+dx,.02,z+dz],[x+dx,.40,z+dz]],m,stool,.038)
    # Hands rise only moderately. The generated rig still needs human review
    # before this is described as a precise ritual gesture.
    for side,sgn in [('l',1),('r',-1)]:
        g.track(eb['upperarm_'+side],'rotation',[0,4,5.6,8,10,12],
                [quat([0,0,1],a*sgn) for a in [-.72,-.72,-.39,-.39,-.72,-.72]],'VEC4')
        g.track(eb['lowerarm_'+side],'rotation',[0,4,5.6,8,10,12],
                [quat([1,0,0],a) for a in [-.65,-.65,-1.1,-1.1,-.65,-.65]],'VEC4')
    return g.write(12)


def shashu():
    g=GLB('shashu');m=mats(g);ground(g,m,3)
    thrower,tb,_=person(g,m,'shashu-host',(0,0,-.48),gender='female',pose='working')
    person(g,m,'welcomed-guest',(-1.2,0,.42),gender='female',yaw=math.pi/4)
    person(g,m,'family-member',(1.25,0,.52),yaw=-math.pi/4)
    container=g.node('sweet-container',extras={'hotspot':'container'})
    bowl_node=bowl(g,m,'wooden-sweets-bowl',(.25,1.04,-.18),.28)
    g.doc['nodes'][0]['children'].remove(bowl_node)
    g.doc['nodes'][container].setdefault('children',[]).append(bowl_node)
    colours=[('amber',(.81,.43,.15)),('cream',(.92,.79,.53)),('red-candy',(.72,.24,.19))]
    for name,c in colours:m[name]=g.material(name,c,rough=.48)
    sweets=g.node('scattered-sweets',extras={'hotspot':'sweets'})
    for k in range(18):
        a=k*2.39996;r=.35+.11*math.sqrt(k)
        x=.25+math.cos(a)*r;z=.18+math.sin(a)*r
        sweet=g.node(f'sweet-{k}',sweets,pos=(.22+(k%4)*.035,1.07,-.12+(k//4)*.018))
        lathe(g,f'sweet-solid-{k}',[(0,0),(.030,.006),(.036,.027),(.025,.044),(0,.048)],
              m[colours[k%3][0]],sweet,segments=12)
        # A keyed arc and zero ground velocity give each solid sweet a stable
        # final arrangement. The deterministic positions remain inspectable.
        g.track(sweet,'translation',[0,4,5.3,6.4,7.4,8.2,12],
                [[.22+(k%4)*.035,1.07,-.12+(k//4)*.018]]*2+
                [[.22+(x-.22)*.30,1.50+(.04*(k%3)),-.12+(z+.12)*.30],
                 [.22+(x-.22)*.65,1.13+(.03*(k%4)),-.12+(z+.12)*.65],
                 [x,.28,z],[x,.07,z],[x,.07,z]],'VEC3')
    g.track(tb['upperarm_r'],'rotation',[0,4,5.5,7.2,8,12],
            [quat([0,0,1],a) for a in [.72,.72,1.7,1.5,.72,.72]],'VEC4')
    return g.write(12)


def qymyzmuryndyq():
    g=GLB('qymyzmuryndyq');m=mats(g);ground(g,m,3.25)
    m['saba-leather']=g.material('saba-leather',(.45,.29,.17),rough=.88)
    textile(g,'summer-gathering-felt',-1.7,1.7,-1.5,1.5,.019,m['felt'])
    person(g,m,'host',(-1.35,0,-.30),gender='female',pose='working',yaw=math.pi/3)
    person(g,m,'guest-one',(1.38,0,-.38),yaw=-math.pi/3)
    person(g,m,'guest-two',(0,0,1.46),gender='female',yaw=math.pi)
    low_table(g,m,'vessels')
    saba=g.node('saba',extras={'hotspot':'saba'})
    lathe(g,'stitched-leather-saba',[(0,0),(.31,.025),(.37,.23),(.35,.58),(.25,.75),
          (.13,.82),(.12,.90),(.15,.92)],m['saba-leather'],saba,centre=(-.56,.23,-.50),segments=64,warp=.025)
    for a in np.linspace(0,TAU,8,endpoint=False):
        runner(g,f'leather-saba-seam-{a:.2f}',[[-.56+(.34-.16*t)*math.cos(a),
               .25+.70*t,-.50+(.34-.16*t)*math.sin(a)] for t in np.linspace(0,1,24)],
               m,saba,.007,'darkcloth')
    runner(g,'saba-handle',[[-.88,.86,-.50],[-.96,1.01,-.50],[-.75,1.12,-.50],[-.68,.89,-.50]],
           m,saba,.035,'leather')
    for k,(x,z) in enumerate([(.33,-.2),(.43,.33),(-.10,.46)]):
        vessel=g.node(f'qymyz-bowl-{k}',extras={'hotspot':'bowls'})
        bowl(g,m,f'wooden-tostagan-{k}',(x,.23,z),.34)
        liquid=lathe(g,f'qymyz-surface-{k}',[(0,0),(.18,0),(.18,.003),(0,.003)],
              m['kozhe'],vessel,centre=(x,.346,z),segments=40)
        stage_visibility(g,liquid,6,12)
    jug=g.node('serving-jug',pos=(-.23,.38,-.10),extras={'hotspot':'jug'})
    lathe(g,'wooden-serving-jug',[(0,0),(.11,.01),(.14,.12),(.12,.31),(.07,.37),(.07,.43)],
          m['wood'],jug,segments=40)
    runner(g,'serving-jug-handle',[[.12,.12,0],[.22,.15,0],[.23,.31,0],[.10,.32,0]],
           m,jug,.018)
    g.track(jug,'rotation',[0,4,5.3,6.7,8,12],
            [quat([0,0,1],a) for a in [0,0,-.57,-.57,0,0]],'VEC4')
    stream=g.node('pouring-qymyz',extras={'hotspot':'qymyz'})
    lathe(g,'short-liquid-stream',[(0,0),(.013,0),(.017,.22),(.018,.35),(0,.35)],
          m['kozhe'],stream,centre=(-.01,.39,-.10),segments=12)
    g.doc['nodes'][stream]['scale']=[.00001]*3
    g.track(stream,'scale',[0,5.2,7,12],[[.00001]*3,[1]*3,[.00001]*3,[.00001]*3],'VEC3','STEP')
    return g.write(12)


SCENES={'besikke-salu':besikke_salu,'betashar':betashar,'syrga-salu':syrga_salu,
        'bata-beru':bata_beru,'shashu':shashu,'qymyzmuryndyq':qymyzmuryndyq}

if __name__=='__main__':
    selected=sys.argv[1:] or list(SCENES)
    old=Path('public/models/asset-stats.json')
    stats=json.loads(old.read_text(encoding='utf-8')) if old.exists() else []
    for key in selected:
        if key not in SCENES: raise SystemExit(f'Unknown scene: {key}')
        result=SCENES[key]();stats=[x for x in stats if x['file']!=result['file']]+[result]
        print(json.dumps(result),flush=True)
    old.write_text(json.dumps(stats,indent=2),encoding='utf-8')
