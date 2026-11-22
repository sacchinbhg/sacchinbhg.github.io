// Twenty original aquatic sculptures, built directly as 3D surfaces.
import {ModelBuilder, MAT as M, STRIDE, TAU} from './geometry.mjs';

const oval=(b,p,r,m=M.GOLD,u=18,v=26,extra={})=>b.ellipsoid(p,r,{material:m,u,v,...extra});
const limb=(b,a,c,r=.035,m=M.GOLD,extra={})=>b.line(a,c,r,{material:m,u:15,v:7,...extra});
function profileEyes(b,center,radius,options={}){
 const start=b.data.length;
 b.eye(center,radius,options);
 const end=b.data.length;
 for(let i=start;i<end;i+=STRIDE){const point=b.data.slice(i,i+STRIDE);point[2]*=-1;point[5]*=-1;b.data.push(...point);}
 return b;
}
function taper(b,a,c,r=.07,m=M.GOLD,extra={}){b.tube(t=>a.map((v,i)=>v+(c[i]-v)*t),t=>r*(1-t)+.004,{material:m,shade:u=>.66+.34*u,u:20,v:10,...extra});}
// Structural marks follow their host surface; they add detail without changing its outline.
const texture=(u,v)=>.84+.16*Math.pow(.5+.5*Math.cos(u*TAU*13+Math.sin(v*TAU*18)*.45),3);
const trace=(b,path,{material=M.IVORY,r=.005,u=22,joint=0,shade=.94}={})=>b.tube(path,r,{material,u,v:4,joint,shade});
function front(c,r,x,y){return c[2]+r[2]*Math.sqrt(Math.max(.002,1-((x-c[0])/r[0])**2-((y-c[1])/r[1])**2))+.006;}
function gill(b,c,r,x,span=.7){
 trace(b,t=>{const y=c[1]+(t-.5)*r[1]*span*2,px=x-.035*Math.sin(t*Math.PI);return[px,y,front(c,r,px,y)];},{material:M.BROWN,r:.007,u:23});
}
function lateralLine(b,c,r,x0,x1,y){trace(b,t=>{const x=x0+(x1-x0)*t;return[x,y,front(c,r,x,y)];},{material:M.SAND,r:.004,u:34,shade:.85});}
function fin(b,a,c,tip,options={}){
 const curve=options.curve??.04,joint=options.joint??0;
 ModelBuilder.prototype.fin.call(b,a,c,tip,{...options,shade:options.shade??((u,v)=>.75+.25*Math.pow(Math.cos(v*Math.PI*5),2))});
 const at=(s,t)=>{const base=a.map((n,k)=>n+(c[k]-n)*t);return base.map((n,k)=>n+(tip[k]-n)*s+(k===2?Math.sin(s*Math.PI)*Math.sin(t*Math.PI)*curve+.004:0));};
 for(let k=1;k<5;k++)trace(b,s=>at(s,k/5),{material:M.SAND,joint,u:12,r:.004,shade:.90});
 for(const edge of [0,1])trace(b,s=>at(s,edge),{material:M.BROWN,joint,u:14,r:.005,shade:.82});
}
function cup(b,p,r=.016,joint=0){trace(b,t=>[p[0]+r*Math.cos(t*TAU),p[1]+r*Math.sin(t*TAU),p[2]],{u:8,r:r*.24,joint,material:M.IVORY});}
function tailFan(b,x,y=0,z=0,m=M.GOLD){fin(b,[x+.12,y-.07,z],[x+.12,y+.07,z],[x-.29,y-.29,z],{material:m,u:19,v:14});fin(b,[x+.12,y-.07,z],[x+.12,y+.07,z],[x-.29,y+.29,z],{material:m,u:19,v:14});}
function beak(b,p,length=.2,depth=.06,m=M.GOLD){b.surface((u,v)=>[p[0]+u*length,p[1]+depth*(1-u)*Math.sin(v*TAU),p[2]+depth*(1-u)*Math.cos(v*TAU)],{u:18,v:14,material:m});}

function clownfish(s,q=1){
 const b=new ModelBuilder(q);
 oval(b,[0,0,0],[.64,.34,.20],M.RUST,32,44,{shade:texture,pattern:(u,v,p)=>{const d=Math.min(Math.abs(p[0]-.28)/.075,Math.abs(p[0]+.12)/.08);return d<1||p[0]<-.47?M.IVORY:d<1.20||p[0]<-.45?M.BROWN:M.RUST;}});
 fin(b,[-.43,-.17,0],[.35,-.21,0],[-.05,-.46,0],{material:M.RUST,u:26,v:14});
 fin(b,[-.32,.20,0],[.17,.27,0],[-.27,.47,0],{material:M.RUST,u:20,v:14});
 const joint=b.joint({pivot:[-.48,0,0],axis:[0,1,0],amplitude:.18,speed:2});tailFan(b,-.64,0,0,M.RUST);
 fin(b,[.21,.02,.17],[-.08,.08,.19],[.07,.29,.31],{material:M.IVORY,joint,u:18,v:12});
 oval(b,[.56,.035,.01],[.13,.13,.15],M.RUST,14,22);profileEyes(b,[.40,-.085,.165],.045);gill(b,[0,0,0],[.64,.34,.20],.25,.60);return b.finish();
}
function angelfish(s,q=1){
 const b=new ModelBuilder(q);oval(b,[.05,0,0],[.34,.48,.12],M.SAND,28,40,{shade:texture,pattern:(u,v,p)=>Math.abs(Math.sin(p[0]*19))<.48?M.NAVY:M.SAND});
 fin(b,[-.20,-.20,0],[.26,-.27,0],[-.31,-.92,0],{material:M.SAND,u:29,v:20});
 fin(b,[-.20,.20,0],[.26,.27,0],[-.31,.87,0],{material:M.SAND,u:27,v:18});
 tailFan(b,-.43,0,0,M.SAND);beak(b,[.30,.015,0],.18,.08,M.SAND);profileEyes(b,[.25,-.11,.105],.038);
 for(const z of [-.05,.05])b.tube(t=>[.19-.12*t,.32+t*.65,z],t=>.014*(1-t)+.003,{material:M.SAND,u:28,v:5});
 gill(b,[.05,0,0],[.34,.48,.12],.20,.46);return b.finish();
}
function pufferfish(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,0,0],[.55,.51,.47],M.GOLD,32,44,{pattern:(u,v)=>Math.sin(u*37)*Math.sin(v*53)>.65?M.BROWN:M.GOLD});
 for(let i=0;i<9;i++)for(let j=0;j<12;j++){const a=(i+.5)/9*Math.PI,v=j*TAU/12,n=[Math.sin(a)*Math.cos(v),Math.cos(a),Math.sin(a)*Math.sin(v)],p=n.map(x=>x*.47);taper(b,p,n.map(x=>x*.63),.026,M.SAND,{u:7,v:5});}
 oval(b,[.48,.08,0],[.13,.10,.13],M.IVORY,12,18);profileEyes(b,[.35,-.12,.35],.055);tailFan(b,-.62,0,0,M.GOLD);
 fin(b,[.1,0,.41],[-.15,.02,.4],[.05,.25,.65],{material:M.SAND,u:15,v:10});
 gill(b,[0,0,0],[.55,.51,.47],.23,.34);trace(b,t=>[.53+.06*Math.cos(t*Math.PI),.08+.022*Math.sin(t*Math.PI),.12],{material:M.BROWN,u:13,r:.007});return b.finish();
}
function swordfish(s,q=1){
 const b=new ModelBuilder(q);oval(b,[-.12,0,0],[.68,.18,.15],M.SLATE,28,42,{shade:texture,pattern:(u,v,p)=>p[1]>.055?M.IVORY:M.SLATE});
 taper(b,[.38,-.025,0],[1.18,-.045,0],.055,M.SLATE,{u:34,v:10});profileEyes(b,[.34,-.06,.13],.028);
 fin(b,[-.44,-.1,0],[.24,-.15,0],[-.06,-.54,0],{material:M.NAVY,u:25,v:17});
 fin(b,[.14,.08,.1],[-.08,.15,.1],[-.35,.30,.34],{material:M.SLATE,u:20,v:14});
 fin(b,[-.74,-.04,0],[-.74,.04,0],[-1.02,-.43,0],{material:M.NAVY,u:21,v:14});fin(b,[-.74,-.04,0],[-.74,.04,0],[-1.01,.37,0],{material:M.NAVY,u:21,v:14});
 gill(b,[-.12,0,0],[.68,.18,.15],.22,.70);lateralLine(b,[-.12,0,0],[.68,.18,.15],-.66,.18,-.015);return b.finish();
}
function claw(b,base,tip,m=M.RUST,large=false){
 const mid=base.map((x,i)=>(x+tip[i])*.5);limb(b,base,mid,large?.06:.035,m);oval(b,tip,[large?.16:.11,large?.24:.15,.07],m,14,18);
 const dir=tip[0]>0?1:-1; taper(b,[tip[0]-.05*dir,tip[1]-.10,tip[2]],[tip[0]-.02*dir,tip[1]-.34,tip[2]],.055,m,{u:12,v:7});taper(b,[tip[0]+.08*dir,tip[1]-.11,tip[2]],[tip[0]+.04*dir,tip[1]-.31,tip[2]],.055,m,{u:12,v:7});
 const r=[large?.16:.11,large?.24:.15,.07];trace(b,t=>{const x=tip[0]+.025*Math.sin(t*Math.PI),y=tip[1]+r[1]*(.65-1.25*t);return[x,y,front(tip,r,x,y)];},{material:M.BROWN,u:17,r:.006});
 for(let k=0;k<3;k++)oval(b,[tip[0]+dir*.018,tip[1]-.15-k*.04,tip[2]+.025],[.014,.014,.014],M.SAND,6,8);
}
function lobster(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,-.06,0],[.20,.39,.14],M.RUST,24,30,{shade:(u,v)=>.86+.14*Math.cos(v*TAU*3)**2});
 for(let k=0;k<6;k++)oval(b,[0,.26+k*.10,-.018*k],[.20-k*.014,.075,.12-k*.008],k%2?M.CORAL:M.RUST,10,20);
 for(const side of [-1,1]){
  claw(b,[side*.16,-.23,0],[side*.43,-.51,0],M.RUST,true);
  for(let k=0;k<4;k++){const a=[side*.15,-.08+k*.13,-.02],c=[side*(.40+.04*k),-.01+k*.15,-.09],d=[side*(.49+.04*k),.16+k*.13,-.13];limb(b,a,c,.025,M.RUST);taper(b,c,d,.025,M.RUST,{u:11,v:6});}
  b.tube(t=>[side*(.07+.30*t+.08*Math.sin(t*2)),-.36-t*.70,.035],t=>.012*(1-t)+.004,{material:M.RUST,u:35,v:5});
  oval(b,[side*.09,-.38,.12],[.035,.035,.035],M.INK,8,10);fin(b,[0,.69,-.09],[side*.12,.65,-.09],[side*.29,.87,-.10],{material:M.RUST,u:16,v:10});
 }
 trace(b,t=>{const y=-.35+t*.58;return[0,y,front([0,-.06,0],[.20,.39,.14],0,y)];},{material:M.BROWN,u:30,r:.007});
 for(let k=0;k<6;k++)trace(b,t=>{const a=t*Math.PI,x=(.20-k*.014)*Math.cos(a);return[x,.26+k*.10,-.018*k+(.12-k*.008)*Math.sin(a)+.005];},{material:M.SAND,u:18,r:.006});return b.finish();
}
function crab(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,.07,0],[.48,.29,.20],M.CORAL,28,40,{shade:(u,v)=>.87+.13*Math.cos(u*TAU*8)**2});
 for(const side of [-1,1]){
  claw(b,[side*.32,-.07,.02],[side*.66,-.36,.02],M.CORAL,true);
  for(let k=0;k<4;k++){const a=[side*.36,.01+k*.10,0],c=[side*(.66+.035*k),-.04+k*.16,-.05],d=[side*(.83-.035*k),.18+k*.17,-.09];limb(b,a,c,.031,M.CORAL);taper(b,c,d,.035,M.CORAL,{u:13,v:6});}
  limb(b,[side*.16,-.13,.12],[side*.19,-.27,.20],.026,M.CORAL);b.eye([side*.19,-.27,.21],.038);
 }
 for(const side of [-1,1])trace(b,t=>{const x=side*(.04+.30*t),y=-.10+.16*Math.sin(t*Math.PI*.7);return[x,y,front([0,.07,0],[.48,.29,.20],x,y)];},{material:M.BROWN,u:25,r:.007});
 trace(b,t=>{const a=t*TAU;return[.43*Math.cos(a),.07+.25*Math.sin(a),.083];},{material:M.SAND,u:65,r:.006});return b.finish();
}
function starfish(s,q=1){
 const b=new ModelBuilder(q);
 b.surface((u,v)=>{const a=v*TAU,r=u*(.48+.33*Math.cos(5*a)),thick=.13*(1-u*u);return[r*Math.sin(a),-r*Math.cos(a),thick];},{u:42,v:100,material:(u,v)=>Math.sin(u*43)*Math.sin(v*TAU*27)>.68?M.GOLD:M.CORAL,shade:(u,v)=>.80+.20*Math.cos(v*TAU*5)**2,twoSided:true});
 b.surface((u,v)=>{const a=v*TAU,r=u*(.48+.33*Math.cos(5*a));return[r*Math.sin(a),-r*Math.cos(a),-.07*(1-u*u)];},{u:16,v:55,material:M.SAND,twoSided:true});
 for(let k=0;k<5;k++){const a=k*TAU/5;trace(b,t=>{const u=.12+t*.77,r=u*.81;return[r*Math.sin(a),-r*Math.cos(a),.13*(1-u*u)+.006];},{material:M.GOLD,u:28,r:.008});
  for(let n=1;n<5;n++){const u=n*.17,r=u*.81;oval(b,[r*Math.sin(a),-r*Math.cos(a),.13*(1-u*u)+.010],[.014,.014,.009],M.SAND,6,8);}}
 return b.finish();
}
function stingray(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,-.12,.01],[.20,.39,.10],M.SAND,23,32);
 for(const side of [-1,1]){
  const wing=(u,v)=>{const lead=-.55+.63*u,back=.54-.46*u;return[side*u*.77,lead+(back-lead)*v,.11*Math.sin(v*Math.PI)*(1-u)-.04*u];};
  b.surface(wing,{u:35,v:30,material:M.SAND,shade:(u,v)=>.82+.18*Math.cos(v*Math.PI*9)**2,twoSided:true});
  for(let k=1;k<7;k++)trace(b,t=>{const p=wing(.12+t*.80,k/7);p[2]+=.005;return p;},{material:M.GOLD,u:20,r:.004,shade:.82});
  trace(b,t=>{const p=wing(t,.98);p[2]+=.005;return p;},{material:M.BROWN,u:24,r:.005});
 }
 const joint=b.joint({pivot:[0,.35,0],axis:[0,0,1],amplitude:.10,speed:.8});b.tube(t=>[.09*Math.sin(t*4),.36+t*1.05,-.02],t=>.033*(1-t)+.004,{material:M.BROWN,u:48,v:8,joint});
 for(const side of [-1,1]){oval(b,[side*.11,-.33,.10],[.055,.08,.055],M.SAND,10,14);b.eye([side*.11,-.35,.14],.025);oval(b,[side*.12,-.235,.105],[.028,.050,.009],M.BROWN,8,12);}
 return b.finish();
}
function squid(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,-.29,0],[.23,.59,.20],M.CORAL,30,40,{shade:(u,v)=>.84+.16*Math.cos(v*TAU*4)**2,pattern:(u,v)=>Math.cos(u*TAU*17+v*8)>.87?M.RUST:M.CORAL});
 for(const side of [-1,1])fin(b,[side*.08,-.78,0],[side*.18,-.15,0],[side*.46,-.46,0],{material:M.CORAL,u:24,v:17});
 oval(b,[0,.22,0],[.23,.19,.20],M.CORAL,18,26);b.eye([-.13,.21,.15],.052);b.eye([.13,.21,.15],.052);
 for(let k=0;k<10;k++){const a=k*TAU/10,length=k<2?.94:.60,joint=b.joint({pivot:[0,.32,0],axis:[0,0,1],amplitude:.05,speed:1.2,phase:k}),path=t=>[Math.cos(a)*(.12+.19*t)+.05*Math.sin(t*5+k)*t,.31+t*length,Math.sin(a)*(.12+.19*t)];
  b.tube(path,t=>.033*(1-t)+.004,{material:M.CORAL,u:26,v:6,joint,shade:u=>.78+.22*u});
  for(let n=1;n<=3;n++){const t=n*.20,p=path(t);p[2]+=.033*(1-t)+.005;cup(b,p,.012*(1-t*.4),joint);}
 }
 trace(b,t=>{const y=-.77+t*.84;return[0,y,front([0,-.29,0],[.23,.59,.20],0,y)];},{material:M.SAND,u:34,r:.005});return b.finish();
}
function shrimp(s,q=1){
 const b=new ModelBuilder(q);
 for(let k=0;k<10;k++){const a=-.45+k*.22,c=[-.13-.41*Math.sin(a),-.04+.40*(1-Math.cos(a)),0],ry=.16-k*.007,rz=.13-k*.007;oval(b,c,[.105,ry,rz],k%2?M.CORAL:M.RUST,12,20,{rotation:-a,shade:(u,v)=>.82+.18*Math.cos(v*TAU*2)**2});
  trace(b,t=>{const theta=t*Math.PI,x=.04,y=ry*Math.cos(theta);return[c[0]+x*Math.cos(a)+y*Math.sin(a),c[1]-x*Math.sin(a)+y*Math.cos(a),rz*Math.sin(theta)*.92+.005];},{material:M.SAND,u:16,r:.005});}
 oval(b,[.22,-.07,0],[.27,.18,.15],M.CORAL,20,28);taper(b,[.35,-.12,0],[.63,-.25,0],.045,M.CORAL);profileEyes(b,[.37,-.14,.11],.037);
 for(let k=0;k<7;k++){const x=.21-k*.075;limb(b,[x,.06,.02],[x-.06,.29,.04],.017,M.CORAL);taper(b,[x-.06,.29,.04],[x+.08,.38,.03],.017,M.CORAL,{u:10,v:5});}
 for(const side of [-1,1])b.tube(t=>[.40+.52*t-.15*t*t,-.10-.18*t-.16*Math.sin(t*3),side*.02+side*.12*t],t=>.012*(1-t)+.003,{material:M.CORAL,u:36,v:5});
 fin(b,[-.53,.20,0],[-.52,.35,0],[-.78,.42,.02],{material:M.CORAL,u:20,v:14});gill(b,[.22,-.07,0],[.27,.18,.15],.22,.70);return b.finish();
}
function tang(s,q=1){
 const b=new ModelBuilder(q);oval(b,[.04,0,0],[.51,.43,.16],M.CYAN,30,42,{shade:texture,pattern:(u,v,p)=>p[0]<-.34?M.NAVY:M.CYAN});
 b.surface((u,v)=>[.42-.82*u,-.25-.18*Math.sin(u*Math.PI)-.15*v*Math.sin(u*Math.PI),.02*Math.sin(u*8)],{u:29,v:14,material:M.GOLD,shade:(u,v)=>.66+.34*Math.cos(u*Math.PI*14)**2,twoSided:true});
 b.surface((u,v)=>[.38-.78*u,.23+.17*Math.sin(u*Math.PI)+.14*v*Math.sin(u*Math.PI),0],{u:27,v:12,material:M.GOLD,shade:(u,v)=>.66+.34*Math.cos(u*Math.PI*14)**2,twoSided:true});
 tailFan(b,-.57,0,0,M.GOLD);oval(b,[.49,.035,0],[.13,.10,.11],M.CYAN,12,18);profileEyes(b,[.35,-.09,.136],.037);
 fin(b,[.15,-.01,.15],[-.02,.07,.15],[-.16,.26,.29],{material:M.GOLD,u:20,v:14});gill(b,[.04,0,0],[.51,.43,.16],.22,.61);lateralLine(b,[.04,0,0],[.51,.43,.16],-.39,.16,-.02);
 trace(b,t=>[-.42+.08*t,-.005,.083],{material:M.IVORY,u:12,r:.011});return b.finish();
}
function lionfish(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,.03,0],[.45,.25,.21],M.IVORY,26,36,{pattern:(u,v,p)=>Math.sin(p[0]*35)>.1?M.RUST:M.IVORY});
 oval(b,[.40,.05,0],[.18,.22,.18],M.RUST,18,26,{pattern:(u,v,p)=>Math.cos((p[0]+p[1]) * 43)>.40?M.IVORY:M.RUST});profileEyes(b,[.43,-.04,.154],.04);tailFan(b,-.50,.03,0,M.RUST);
 for(let k=0;k<11;k++){const x=.30-k*.066;taper(b,[x,-.12,0],[x-.16,-.67+.12*Math.abs(k-5)/5,0],.025,M.IVORY,{u:20,v:6});}
 for(const side of [-1,1]){
  const joint=b.joint({pivot:[.18,.08,side*.13],axis:[1,0,0],amplitude:.05,speed:.8});
  b.surface((u,v)=>{const a=v*Math.PI*.9-.25;return[.18-u*.57*Math.sin(a),.08+u*.41*Math.cos(a),side*(.13+u*.58)];},{u:23,v:27,material:(u,v)=>Math.sin(v*TAU*12)>.2?M.RUST:M.IVORY,shade:(u,v)=>.71+.29*Math.cos(u*Math.PI*5)**2,joint,twoSided:true});
  for(let k=0;k<9;k++){const a=k/8*Math.PI*.9-.25;taper(b,[.18,.08,side*.13],[.18-.62*Math.sin(a),.08+.46*Math.cos(a),side*.77],.012,M.SAND,{u:20,v:4,joint});}
 }gill(b,[0,.03,0],[.45,.25,.21],.24,.65);return b.finish();
}
function betta(s,q=1){
 const b=new ModelBuilder(q);oval(b,[.22,0,0],[.43,.19,.14],M.CORAL,25,36,{shade:texture});profileEyes(b,[.49,-.055,.115],.035);
 const tail=b.joint({pivot:[-.12,0,0],axis:[0,1,0],amplitude:.13,speed:1.2});
 const fan=(u,v)=>{const a=(v-.5)*Math.PI*1.10,r=.12+u*.74,wave=.03*Math.sin(v*TAU*14)*u;return[-.12-r*Math.cos(a),r*Math.sin(a),wave+.065*Math.sin(u*Math.PI)*Math.sin(v*9)];};
 b.surface(fan,{u:38,v:54,material:(u,v)=>u>.85?M.CYAN:M.CORAL,shade:(u,v)=>.64+.36*Math.cos(v*Math.PI*14)**2,joint:tail,twoSided:true});
 for(let k=1;k<9;k++)trace(b,t=>{const p=fan(t,k/9);p[2]+=.005;return p;},{material:M.SAND,joint:tail,u:24,r:.004,shade:.87});
 trace(b,t=>{const p=fan(.985,t);p[2]+=.005;return p;},{material:M.IVORY,joint:tail,u:50,r:.005});
 b.surface((u,v)=>[.40-u*.70,-.12-v*(.17+.20*Math.sin(u*Math.PI)),.03*Math.sin(u*30)*v],{u:32,v:20,material:M.CORAL,shade:(u,v)=>.67+.33*Math.cos(u*Math.PI*13)**2,twoSided:true});
 b.surface((u,v)=>[.43-u*.67,.12+v*(.16+.31*Math.sin(u*Math.PI)),.03*Math.sin(u*28)*v],{u:32,v:22,material:M.CORAL,shade:(u,v)=>.67+.33*Math.cos(u*Math.PI*13)**2,twoSided:true});
 for(const z of [-.05,.05])b.tube(t=>[.38-.20*t,.13+t*.40,z],t=>.02*(1-t)+.003,{material:M.CYAN,u:23,v:5});gill(b,[.22,0,0],[.43,.19,.14],.39,.73);return b.finish();
}
function moray(s,q=1){
 const b=new ModelBuilder(q),path=t=>[-.83+1.62*t,.20*Math.sin(t*TAU*1.25),.05*Math.sin(t*TAU)];
 b.tube(path,t=>.035+.12*Math.sin(t*Math.PI*.66),{material:(u,v)=>Math.abs(Math.sin(u*47+Math.sin(v*19)))*Math.abs(Math.cos(v*22+u*9))<.22?M.GOLD:M.BROWN,shade:texture,u:88,v:30});
 b.surface((u,v)=>{const p=path(u);return[p[0],p[1]-.06-v*(.08*Math.sin(u*Math.PI)),p[2]];},{u:65,v:10,material:M.GREEN,shade:(u,v)=>.70+.30*Math.cos(u*Math.PI*24)**2,twoSided:true});
 oval(b,[.79,.18,.015],[.24,.15,.15],M.BROWN,22,30,{shade:texture,pattern:(u,v)=>Math.abs(Math.sin(u*27+Math.sin(v*15)))<.23?M.GOLD:M.BROWN});oval(b,[.88,.25,.01],[.22,.055,.12],M.GOLD,14,22);profileEyes(b,[.83,.12,.135],.033);
 limb(b,[.82,.215,.14],[1.09,.22,.08],.010,M.INK,{u:22,v:5});for(let k=0;k<5;k++)taper(b,[.86+k*.04,.21,.13],[.86+k*.04,.24,.13],.01,M.IVORY,{u:5,v:4});
 gill(b,[.79,.18,.015],[.24,.15,.15],.65,.52);oval(b,[.98,.155,.10],[.018,.012,.012],M.INK,6,8);return b.finish();
}
function lionsMane(s,q=1){
 const b=new ModelBuilder(q);
 const bell=(u,v)=>{const a=v*TAU,r=.52*Math.sin(u*Math.PI*.5)*(1+.035*Math.cos(a*8));return[r*Math.cos(a),-.64+.25*(1-Math.cos(u*Math.PI*.5))+.028*Math.sin(a*16)*u,r*Math.sin(a)];};
 b.surface(bell,{u:29,v:54,material:(u,v)=>Math.cos(v*TAU*8)>.7?M.RUST:M.GOLD,shade:(u,v)=>.79+.21*Math.cos(v*TAU*8)**2,twoSided:true});
 for(let k=0;k<8;k++)trace(b,t=>{const p=bell(.08+t*.90,k/8);p[1]-=.006;return p;},{material:M.SAND,u:25,r:.008});
 trace(b,t=>{const p=bell(.985,t);p[1]-=.004;return p;},{material:M.CORAL,u:80,r:.008});
 for(let k=0;k<36;k++){const a=k*TAU/36,r=.12+(k%3)*.15,j=b.joint({pivot:[0,-.39,0],axis:[1,0,0],amplitude:.05,speed:.6,phase:k*.5});b.tube(t=>[r*Math.cos(a)+.07*Math.sin(t*9+k)*t,-.39+t*(.95+.13*Math.sin(k*3)),r*Math.sin(a)+.09*Math.cos(t*7+k)*t],t=>.010*(1-t)+.002,{material:k%3?M.CORAL:M.GOLD,u:25,v:4,joint:j});}
 for(let k=0;k<6;k++){const a=k*TAU/6;b.surface((u,v)=>[(.11+.06*Math.sin(u*12))*Math.cos(a)+(v-.5)*.11*Math.cos(u*14),-.38+u*.64,(.11+.06*Math.sin(u*12))*Math.sin(a)+(v-.5)*.11*Math.sin(u*14)],{u:25,v:8,material:M.CORAL,shade:(u,v)=>.66+.34*Math.cos(u*Math.PI*8)**2,twoSided:true});}return b.finish();
}
function blueOctopus(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,-.31,0],[.29,.37,.23],M.SAND,27,36,{shade:(u,v)=>.87+.13*Math.cos(u*36+v*17)**2});oval(b,[0,-.01,0],[.25,.16,.21],M.SAND,16,24);b.eye([-.13,-.06,.18],.045);b.eye([.13,-.06,.18],.045);
 for(let k=0;k<8;k++){const a=k*TAU/8,joint=b.joint({pivot:[Math.cos(a)*.1,.04,Math.sin(a)*.1],axis:[Math.sin(a),0,Math.cos(a)],amplitude:.08,speed:.8,phase:k});
  const path=t=>[Math.cos(a)*(.12+.57*t)+.12*Math.sin(t*7+k)*t,.04+.49*t+.10*Math.sin(t*5+k),Math.sin(a)*(.12+.43*t)];b.tube(path,t=>.07*(1-t)+.004,{material:M.SAND,u:34,v:10,joint});
  for(let n=1;n<=4;n++){const p=path(n*.17);b.tube(t=>[p[0]+.026*Math.cos(t*TAU),p[1]+.026*Math.sin(t*TAU),p[2]+.045*(1-n*.13)],.008,{material:M.CYAN,u:12,v:4,joint});}
  for(let n=1;n<=3;n++){const t=.13+n*.18,p=path(t);p[0]+=.018;p[2]+=.07*(1-t)+.005;cup(b,p,.014*(1-t*.4),joint);}
 }for(let k=0;k<8;k++){const a=k*TAU/8,x=.17*Math.cos(a),y=-.31+.24*Math.sin(a);b.tube(t=>[x+.037*Math.cos(t*TAU),y+.037*Math.sin(t*TAU),.20],.01,{material:M.CYAN,u:15,v:5});}return b.finish();
}
function seaDragon(s,q=1){
 const b=new ModelBuilder(q);b.tube(t=>[-.25+.33*Math.sin(t*4.6),-.63+t*1.28,.01],t=>.045+.065*Math.sin(t*Math.PI),{material:(u,v)=>Math.cos(u*Math.PI*29)>.78?M.BROWN:M.GOLD,shade:(u,v)=>.80+.20*Math.cos(v*TAU*4)**2,u:58,v:18});
 oval(b,[-.20,-.61,0],[.16,.10,.09],M.GOLD,17,24);beak(b,[-.10,-.59,0],.30,.035,M.GOLD);profileEyes(b,[-.14,-.63,.08],.027);
 b.tube(t=>[-.58+.20*Math.cos(t*5),.59+.16*Math.sin(t*5),0],t=>.036*(1-t)+.004,{material:M.GOLD,u:32,v:8});
 for(let k=0;k<11;k++){const t=(k+.3)/12,p=[-.25+.33*Math.sin(t*4.6),-.63+t*1.28,0],side=k%2?1:-1,tip=[p[0]+side*(.24+.07*Math.sin(k)),p[1]-.15,.02];limb(b,p,tip,.012,M.GREEN,{u:13,v:4});
  const leaf=(u,v)=>{const w=Math.sin(u*Math.PI)*.10*(v-.5);return[tip[0]+side*u*.19,tip[1]-u*.14+w,tip[2]+Math.sin(u*Math.PI)*.03];};b.surface(leaf,{u:17,v:9,material:M.GREEN,shade:(u,v)=>.72+.28*Math.cos(v*Math.PI*2)**2,twoSided:true});
  trace(b,t=>{const p=leaf(t,.5);p[2]+=.004;return p;},{material:M.SAND,u:15,r:.004});
 }
 return b.finish();
}
function hermitCrab(s,q=1){
 const b=new ModelBuilder(q),shell=(u,v)=>{const a=u*TAU*1.4,r=.07*Math.exp(a*.20),w=r*.55,t=v*TAU;return[-.22+(r+w*Math.cos(t))*Math.cos(a),-.10+(r+w*Math.cos(t))*Math.sin(a),w*Math.sin(t)];};
 b.surface(shell,{u:72,v:30,material:(u,v)=>Math.sin(u*TAU*24)>.5?M.BROWN:M.GOLD,shade:(u,v)=>.80+.20*Math.cos(u*TAU*24)**2,twoSided:true});
 for(let k=0;k<8;k++)trace(b,t=>{const p=shell(.34+k*.085,t);p[2]+=.004;return p;},{material:M.SAND,u:24,r:.005});
 oval(b,[.28,.30,.08],[.24,.18,.19],M.CORAL,19,26);claw(b,[.37,.24,.14],[.65,.16,.18],M.CORAL,false);claw(b,[.25,.25,-.10],[.50,.17,-.16],M.CORAL,false);
 for(const side of [-1,1]){for(let k=0;k<3;k++){const a=[.1+k*.1,.35,side*.09],c=[.24+k*.13,.48,side*.28],d=[.15+k*.17,.65,side*.32];limb(b,a,c,.024,M.CORAL);taper(b,c,d,.028,M.CORAL,{u:12,v:6});}limb(b,[.37,.23,side*.10],[.44,.04,side*.13],.022,M.CORAL);oval(b,[.44,.04,side*.13],[.035,.035,.035],M.INK,8,10);}return b.finish();
}
function urchin(s,q=1){
 const b=new ModelBuilder(q);oval(b,[0,0,0],[.41,.38,.41],M.NAVY,24,34,{pattern:(u,v)=>Math.abs(Math.sin(v*Math.PI*5))<.24?M.SAND:M.NAVY,shade:(u,v)=>.72+.28*Math.cos(u*Math.PI*11)**2});
 for(let k=0;k<90;k++){const y=1-2*(k+.5)/90,a=k*2.399963,r=Math.sqrt(1-y*y),n=[r*Math.cos(a),y,r*Math.sin(a)],length=.63+.13*Math.sin(k*3.7);taper(b,n.map(x=>x*.35),n.map(x=>x*length),.020,M.GOLD,{u:10,v:5,shade:(u,v)=>.63+.37*u,material:(u,v)=>u>.84?M.SAND:M.GOLD});}
 for(let k=0;k<5;k++){const a=k*TAU/5;trace(b,t=>{const u=.13+.74*t;return[.414*Math.sin(u*Math.PI)*Math.cos(a),.384*Math.cos(u*Math.PI),.414*Math.sin(u*Math.PI)*Math.sin(a)];},{material:M.SAND,u:24,r:.006});}return b.finish();
}
function scallop(s,q=1){
 const b=new ModelBuilder(q);
 const valve=(u,v,side)=>{const a=(v-.5)*Math.PI*1.06,r=u*.88,pleat=1+.045*Math.cos(v*Math.PI*34);return[r*Math.sin(a)*pleat,.38-r*Math.cos(a)*pleat,side*(.05+.18*Math.sin(u*Math.PI*.9)*Math.sin(v*Math.PI))];};
 for(const side of [-1,1]){
  b.surface((u,v)=>valve(u,v,side),{u:39,v:54,material:(u,v)=>Math.cos(v*Math.PI*34)>.3?M.CORAL:M.SAND,shade:(u,v)=>.75+.25*Math.cos(v*Math.PI*17)**2,twoSided:true});
  for(let k=1;k<=4;k++)trace(b,t=>{const p=valve(.16+k*.17,t,side);p[2]+=.005*side;return p;},{material:k%2?M.BROWN:M.IVORY,u:42,r:.005,shade:.88});
 }
 for(const side of [-1,1])fin(b,[0,.32,0],[0,.48,0],[side*.30,.40,0],{material:M.CORAL,u:19,v:13});
 b.tube(t=>{const a=(t-.5)*Math.PI*1.06;return[.88*Math.sin(a),.38-.88*Math.cos(a),0];},.012,{material:M.INK,u:60,v:5});return b.finish();
}

const model=(id,name,build,orientation=[-.16,-.20,0],minSize=.10)=>({id,name,category:'Aquarium',orientation,minSize,build});
export const WILDLIFE_MODELS=[
 model('clownfish','Clownfish',clownfish),model('angelfish','Angelfish',angelfish,[0,-.18,0]),
 model('pufferfish','Pufferfish',pufferfish),model('swordfish','Swordfish',swordfish,[-.16,-.20,-.08],.11),
 model('lobster','Lobster',lobster,[-.12,.13,-.18],.12),model('crab','Crab',crab,[-.22,.08,0],.11),
 model('starfish','Starfish',starfish,[-.20,.12,.12]),model('stingray','Stingray',stingray,[-.22,.1,-.20],.11),
 model('squid','Squid',squid,[-.17,.18,.15],.11),model('shrimp','Shrimp',shrimp,[-.12,-.18,0],.11),
 model('tang','Tang',tang),model('lionfish','Lionfish',lionfish,[-.30,-.15,0],.12),
 model('betta','Betta',betta,[-.12,-.15,0],.11),model('moray-eel','Moray eel',moray,[-.13,-.10,0],.12),
 model('lions-mane-jellyfish',"Lion’s mane jellyfish",lionsMane,[-.23,.10,0],.11),model('blue-ringed-octopus','Blue-ringed octopus',blueOctopus,[-.15,.15,0],.11),
 model('sea-dragon','Leafy sea dragon',seaDragon,[-.1,-.15,0],.12),model('hermit-crab','Hermit crab',hermitCrab,[-.20,-.20,0],.11),
 model('sea-urchin','Sea urchin',urchin,[-.15,.15,0]),model('scallop','Scallop',scallop,[-.16,-.23,0],.10),
];
