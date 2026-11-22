import { ModelBuilder, MAT, TAU, rng } from './geometry.mjs';

function planet(seed,q,type) {
  const b=new ModelBuilder(q),random=rng(seed),craters=Array.from({length:24},()=>({x:random()*2-1,y:random()*2-1,r:.04+random()*.16}));
  if(type==='moon') {
    const basins=Array.from({length:34},()=>{const a=random()*TAU,y=random()*2-1,r=Math.sqrt(1-y*y);return {p:[Math.cos(a)*r,y,Math.sin(a)*r],radius:.045+random()*.14};});
    b.surface((u,v)=>{
      const a=u*Math.PI,t=v*TAU,p=[Math.sin(a)*Math.cos(t),Math.cos(a),Math.sin(a)*Math.sin(t)];let height=0;
      for(const c of basins){const d=Math.hypot(p[0]-c.p[0],p[1]-c.p[1],p[2]-c.p[2])/c.radius;if(d<1.3)height+=-.035*Math.max(0,1-d*d)**2+.016*Math.exp(-(((d-.91)/.16)**2));}
      return p.map(n=>n*(.68+height));
    },{u:86,v:132,flip:true,material:(u,v,p)=>craters.some(c=>(p[0]-c.x)**2+(p[1]-c.y)**2<c.r*c.r)?MAT.SLATE:MAT.IVORY,shade:(u,v)=>.88+.12*Math.sin(v*93)*Math.cos(u*63)});
    return b.finish();
  }
  b.ellipsoid([0,0,0],[.68,.65,.68],{u:72,v:112,material:MAT.SAND,
    pattern:(u,v,p)=>{
      if(type==='moon') return craters.some(c=>(p[0]-c.x)**2+(p[1]-c.y)**2<c.r*c.r)?MAT.SLATE:MAT.IVORY;
      const bands=Math.sin(u*53+Math.sin(v*TAU*3)*.45)+Math.sin(u*119)*.3;
      if(type==='jupiter'&&((p[0]-.27)/.20)**2+((p[1]-.15)/.09)**2<1&&p[2]>0)return MAT.RUST;
      return bands>.5?MAT.SAND:bands<-.55?MAT.BROWN:MAT.IVORY;
    },shade:(u,v,p)=>type==='moon'?(.83+.17*Math.sin(v*93)*Math.cos(u*63)):1});
  if(type==='saturn') {
    b.surface((u,v)=>{const a=v*TAU,r=.88+u*.57;return [Math.cos(a)*r,Math.sin(a)*r*.30,Math.sin(a)*r*.95];},
      {u:30,v:154,material:(u)=>u>.48&&u<.55?MAT.INK:u>.75?MAT.BROWN:MAT.SAND,twoSided:true,shade:.85});
  }
  return b.finish();
}
function galaxy(seed,q) {
  const b=new ModelBuilder(q),random=rng(seed);
  b.ellipsoid([0,0,0],[.18,.10,.18],{material:MAT.IVORY,emissive:true,u:25,v:36});
  for(let i=0;i<Math.round(10500*q*q);i++) {
    const radius=Math.pow(random(),.68),arm=i%4,a=arm*TAU/4+radius*6.4+(random()-.5)*(.2+radius*.50);
    const p=[Math.cos(a)*radius,(random()-.5)*.08*(1-radius)+Math.sin(a)*radius*.16,Math.sin(a)*radius*.85];
    b.point(p,[0,-.2,1],radius<.25?MAT.GOLD:i%7===0?MAT.CORAL:MAT.CYAN,.35+random()*.65,0,2);
  }
  return b.finish();
}
function comet(seed,q) {
  const b=new ModelBuilder(q),random=rng(seed);
  b.ellipsoid([.6,.12,0],[.10,.10,.10],{material:MAT.IVORY,emissive:true,u:25,v:36});
  for(let i=0;i<Math.round(9000*q*q);i++) {
    const t=Math.pow(random(),1.5),a=random()*TAU,r=random()*(.035+t*.19);
    const ion=i%3===0;
    b.point([.6-t*1.65,.12+(ion?-.18*t:-.45*t*t)+Math.cos(a)*r,Math.sin(a)*r],[0,0,1],ion?MAT.CYAN:MAT.SAND,(1-t)*.65+.12,0,2);
  }
  return b.finish();
}
// Authored star-chart silhouettes, with illustrative depth rather than distance-to-scale.
const charts={
  orion:{stars:[[-.43,-.66,.02], [.34,-.56,-.08],[-.15,-.02,.08],[.03,-.07,-.02],[.22,-.12,.10],[-.33,.72,-.06],[.49,.61,.04],[.02,.25,.02],[.01,.39,0],[-.13,-.91,-.04]],edges:[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[5,6],[3,7],[7,8],[0,9],[1,9]]},
  cygnus:{stars:[[.08,-.88,0],[0,-.26,.09],[-.45,-.14,-.04],[-.87,.07,.02],[.43,-.03,-.06],[.82,.29,.03],[-.15,.37,-.07],[-.23,.86,.02]],edges:[[0,1],[1,2],[2,3],[1,4],[4,5],[1,6],[6,7]]},
  'ursa-major':{stars:[[-.92,-.24,0],[-.63,-.38,.03],[-.29,-.29,-.03],[.04,-.04,.06],[.63,-.10,0],[.53,.39,-.04],[.02,.32,.05]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]}
};
function constellation(seed,q,type) {
  const b=new ModelBuilder(q),random=rng(seed),{stars,edges}=charts[type];
  for(const [a,c] of edges)b.line(stars[a],stars[c],.0018,{u:60,v:4,material:MAT.SLATE,shade:.45,emissive:true});
  stars.forEach((p,i)=>{
    const r=i===0?.029:.018+(i%3)*.005;
    b.ellipsoid(p,[r,r,r],{u:12,v:18,material:type==='orion'&&i===0?MAT.CORAL:MAT.WHITE,emissive:true});
    b.line([p[0]-r*2.5,p[1],p[2]],[p[0]+r*2.5,p[1],p[2]],.0016,{material:MAT.IVORY,emissive:true});
    b.line([p[0],p[1]-r*2.5,p[2]],[p[0],p[1]+r*2.5,p[2]],.0016,{material:MAT.IVORY,emissive:true});
  });
  for(let i=0;i<160;i++)b.point([(random()-.5)*1.8,(random()-.5)*1.8,(random()-.5)*.4],[0,0,1],MAT.SLATE,.16+random()*.25,0,2);
  return b.finish();
}
export const SPACE_MODELS=[
  {id:'saturn',name:'Saturn',category:'Space',orientation:[.13,0,-.30],build:(s,q)=>planet(s,q,'saturn')},
  {id:'jupiter',name:'Jupiter',category:'Space',orientation:[0,0,.08],build:(s,q)=>planet(s,q,'jupiter')},
  {id:'moon',name:'Moon',category:'Space',orientation:[0,0,0],build:(s,q)=>planet(s,q,'moon')},
  {id:'spiral-galaxy',name:'Spiral galaxy',category:'Space',orientation:[-.55,0,-.35],build:galaxy},
  {id:'comet',name:'Comet',category:'Space',orientation:[0,.10,-.15],build:comet},
  ...Object.keys(charts).map(id=>({id,name:({orion:'Orion',cygnus:'Cygnus','ursa-major':'Ursa Major · Big Dipper'})[id],category:'Space',orientation:[0,0,0],build:(s,q)=>constellation(s,q,id)}))
];
