// Original surface-sampling toolkit. Coordinates: x right, y down, z toward viewer.
export const STRIDE = 10;
export const TAU = Math.PI * 2;
export const MAT = Object.freeze({IVORY:0,GOLD:1,GREEN:2,SLATE:3,NAVY:4,CORAL:5,WHITE:6,INK:7,RUST:8,CYAN:9,BROWN:10,SAND:11});
export function rng(seed=1){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const mix=(a,b,t)=>a+(b-a)*t;
export const lerp3=(a,b,t)=>a.map((n,i)=>mix(n,b[i],t));
export function rotationMatrix(x,y,z){
  const a=Math.cos(x),b=Math.sin(x),c=Math.cos(y),d=Math.sin(y),e=Math.cos(z),f=Math.sin(z);
  return [c*e,b*d*e-a*f,a*d*e+b*f,c*f,b*d*f+a*e,a*d*f-b*e,-d,b*c,a*c];
}
const unit=v=>{const d=Math.hypot(...v)||1;return v.map(n=>n/d);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

export class ModelBuilder {
  constructor(quality=1){this.quality=quality;this.data=[];this.joints=[];}
  point(p,n=[0,0,1],material=0,shade=1,joint=0,flags=0){this.data.push(...p,...n,material,shade,joint,flags);}
  joint({pivot=[0,0,0],axis=[0,0,1],amplitude=.2,speed=1,phase=0,parent=0}={}){
    this.joints.push({pivot,axis:unit(axis),amplitude,speed,phase,parent});return this.joints.length;
  }
  surface(fn,{u=28,v=24,material=0,shade=1,joint=0,twoSided=false,flip=false,emissive=false}={}){
    const rows=Math.max(4,Math.round(u*this.quality)),cols=Math.max(4,Math.round(v*this.quality));
    for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
      const a=i/rows,b=j/cols,du=a>.999?-.0005:.0005,dv=b>.999?-.0005:.0005;
      const p=fn(a,b),pu=fn(a+du,b),pv=fn(a,b+dv);
      let normal=unit(cross(pu.map((n,k)=>(n-p[k])/du),pv.map((n,k)=>(n-p[k])/dv)));
      if(flip)normal=normal.map(n=>-n);
      this.point(p,normal,typeof material==='function'?material(a,b,p):material,typeof shade==='function'?shade(a,b,p):shade,typeof joint==='function'?joint(a,b):joint,(twoSided?1:0)|(emissive?2:0));
    }return this;
  }
  ellipsoid(center,radii,{material=0,shade=1,joint=0,rotation=0,u=22,v=34,pattern,emissive=false}={}){
    const rows=Math.max(6,Math.round(u*this.quality)),cols=Math.max(8,Math.round(v*this.quality));
    const cr=Math.cos(rotation),sr=Math.sin(rotation);
    for(let i=0;i<=rows;i++)for(let j=0;j<cols;j++){
      const a=i/rows*Math.PI,b=j/cols*TAU;
      const local=[Math.sin(a)*Math.cos(b)*radii[0],Math.cos(a)*radii[1],Math.sin(a)*Math.sin(b)*radii[2]];
      const n=unit(local.map((x,k)=>x/(radii[k]*radii[k])));
      const p=[center[0]+local[0]*cr-local[1]*sr,center[1]+local[0]*sr+local[1]*cr,center[2]+local[2]];
      const normal=[n[0]*cr-n[1]*sr,n[0]*sr+n[1]*cr,n[2]];
      this.point(p,normal,pattern?pattern(i/rows,j/cols,local):material,typeof shade==='function'?shade(i/rows,j/cols,local):shade,joint,emissive?2:0);
    }return this;
  }
  // A tapered curved tube with a locally perpendicular cross section.
  tube(path,radius,{u=32,v=10,material=0,shade=1,joint=0,emissive=false}={}){
    return this.surface((a,b)=>{
      const p=path(a),ahead=path(Math.min(1,a+.001)),behind=path(Math.max(0,a-.001));
      const tangent=unit(ahead.map((x,k)=>x-behind[k]));
      const helper=Math.abs(tangent[1])<.9?[0,1,0]:[1,0,0];
      const side=unit(cross(tangent,helper)),up=cross(tangent,side);
      const r=typeof radius==='function'?radius(a):radius,angle=b*TAU;
      return p.map((x,k)=>x+r*(side[k]*Math.cos(angle)+up[k]*Math.sin(angle)));
    },{u,v,material,shade,joint,emissive,flip:true});
  }
  line(a,b,r=.012,options={}){return this.tube(t=>lerp3(a,b,t),r,{u:16,v:6,...options});}
  // Thin membrane or fin: base endpoints and a third, pointed tip. Curvature gives depth.
  fin(a,b,tip,{material=0,joint=0,shade=1,curve=.04,u=24,v=16}={}){
    return this.surface((s,t)=>{
      const base=lerp3(a,b,t),p=lerp3(base,tip,s);
      p[2]+=Math.sin(s*Math.PI)*Math.sin(t*Math.PI)*curve;
      return p;
    },{u,v,material,joint,shade,twoSided:true});
  }
  eye(center,radius=.025,{joint=0,iris=MAT.GOLD}={}){
    this.ellipsoid(center,[radius,radius,radius*.65],{material:iris,joint,u:9,v:12});
    this.ellipsoid([center[0]+radius*.08,center[1],center[2]+radius*.55],[radius*.5,radius*.65,radius*.23],{material:MAT.INK,joint,u:8,v:10});
    this.ellipsoid([center[0]-radius*.18,center[1]-radius*.24,center[2]+radius*.76],[radius*.19,radius*.19,radius*.1],{material:MAT.WHITE,joint,u:6,v:8});return this;
  }
  finish(){
    let radius=0;for(let i=0;i<this.data.length;i+=STRIDE)radius=Math.max(radius,Math.hypot(this.data[i],this.data[i+1],this.data[i+2]));
    const scale=radius>0?1/radius:1;
    for(let i=0;i<this.data.length;i+=STRIDE){this.data[i]*=scale;this.data[i+1]*=scale;this.data[i+2]*=scale;}
    return {points:new Float32Array(this.data),joints:this.joints.map(j=>({...j,pivot:j.pivot.map(n=>n*scale)}))};
  }
}
