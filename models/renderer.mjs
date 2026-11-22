import { STRIDE, rotationMatrix as rotation } from './geometry.mjs';
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const ramp=' .,:;+=x*%#@';
const colors=[[225,216,192],[208,181,116],[142,174,121],[137,159,170],[91,122,147],[219,160,143],[231,232,218],[47,54,52],[195,119,75],[145,196,200],[142,121,95],[202,181,148]];
// A continuous pigment wheel. Each form gets its own seeded starting colour,
// then light and surface position let neighbouring colours wash across it.
const pigmentCount=36;
for(let i=0;i<pigmentCount;i++){
 const h=i/pigmentCount*6,c=.57,x=c*(1-Math.abs(h%2-1)),m=.38;
 const rgb=h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x];
 colors.push(rgb.map(v=>Math.round((v+m)*255)));
}
// Pale anatomy (fin rays, shell rims, stripes) keeps its material contrast
// inside each creature's changing colour, rather than disappearing into it.
const pearlStart=colors.length;
for(let i=0;i<pigmentCount;i++)colors.push(colors[12+i].map(c=>Math.round(c*.70+255*.30)));
const materialLight=[1.13,1.03,.94,.87,.76,1.02,1.22,.31,.85,1.06,.74,1.07];
const materialHue=[.018,.032,-.012,-.018,-.035,.025,.01,0,.025,-.02,.012,.022];
const tones=12;
function multiply(a,b){const out=new Array(9);for(let r=0;r<3;r++)for(let c=0;c<3;c++)out[r*3+c]=a[r*3]*b[c]+a[r*3+1]*b[3+c]+a[r*3+2]*b[6+c];return out;}
function jointsFor(joints,time){
 const transforms=[{m:[1,0,0,0,1,0,0,0,1],t:[0,0,0]}];
 for(const joint of joints){
  const [x,y,z]=joint.axis,angle=Math.sin(time*joint.speed+joint.phase)*joint.amplitude,c=Math.cos(angle),s=Math.sin(angle),k=1-c,p=joint.pivot;
  let m=[c+x*x*k,x*y*k-z*s,x*z*k+y*s,y*x*k+z*s,c+y*y*k,y*z*k-x*s,z*x*k-y*s,z*y*k+x*s,c+z*z*k];
  let t=[p[0]-(m[0]*p[0]+m[1]*p[1]+m[2]*p[2]),p[1]-(m[3]*p[0]+m[4]*p[1]+m[5]*p[2]),p[2]-(m[6]*p[0]+m[7]*p[1]+m[8]*p[2])];
  if(joint.parent){
   const parent=transforms[joint.parent],a=parent.m,n=new Array(9);
   for(let r=0;r<3;r++)for(let col=0;col<3;col++)n[r*3+col]=a[r*3]*m[col]+a[r*3+1]*m[3+col]+a[r*3+2]*m[6+col];
   t=[a[0]*t[0]+a[1]*t[1]+a[2]*t[2]+parent.t[0],a[3]*t[0]+a[4]*t[1]+a[5]*t[2]+parent.t[1],a[6]*t[0]+a[7]*t[1]+a[8]*t[2]+parent.t[2]];m=n;
  }
  transforms.push({m,t});
 }return transforms;
}
export class AsciiRenderer {
 constructor(canvas){this.canvas=canvas;this.context=canvas.getContext('2d',{alpha:false});if(!this.context)throw new Error('Canvas is unavailable.');this.exiting=[];}
 resize(width,height,dpr=1,cell=4.5){
  this.width=width;this.height=height;this.dpr=Math.min(dpr,2);this.canvas.width=Math.round(width*this.dpr);this.canvas.height=Math.round(height*this.dpr);this.context.setTransform(this.dpr,0,0,this.dpr,0,0);
  this.cols=Math.ceil(width/cell);this.cw=width/this.cols;this.ch=this.cw*1.65;this.rows=Math.ceil(height/this.ch);this.depth=new Float32Array(this.cols*this.rows);this.tiles=new Int16Array(this.depth.length);
  this.tw=Math.ceil(this.cw*this.dpr);this.th=Math.ceil(this.ch*this.dpr);this.atlas=document.createElement('canvas');this.atlas.width=this.tw*ramp.length;this.atlas.height=this.th*colors.length*tones;
  this.buildWaterBackdrop();
  const ctx=this.atlas.getContext('2d');ctx.font=`600 ${Math.round(this.ch*this.dpr*.96)}px "Courier New", monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
  colors.forEach((rgb,color)=>{for(let tone=0;tone<tones;tone++){const light=.45+tone/(tones-1)*.55;ctx.fillStyle=`rgb(${rgb.map(c=>Math.round(c*light)).join(',')})`;for(let glyph=1;glyph<ramp.length;glyph++)ctx.fillText(ramp[glyph],(glyph+.5)*this.tw,(color*tones+tone+.52)*this.th);}});
  // Cache glyph pixels once, then upload one complete character layer per frame.
  // Thousands of tiny drawImage calls cost more than the 3D projection itself.
  const atlasPixels=new Uint32Array(ctx.getImageData(0,0,this.atlas.width,this.atlas.height).data.buffer);
  this.glyphPixels=Array.from({length:colors.length*tones*ramp.length},(_,tile)=>{
   const pixels=new Uint32Array(this.tw*this.th),sx=tile%ramp.length*this.tw,sy=Math.floor(tile/ramp.length)*this.th;
   for(let y=0;y<this.th;y++)for(let x=0;x<this.tw;x++)pixels[y*this.tw+x]=atlasPixels[(sy+y)*this.atlas.width+sx+x];
   return pixels;
  });
  this.characterLayer=document.createElement('canvas');this.characterLayer.width=this.cols*this.tw;this.characterLayer.height=this.rows*this.th;
  this.characterContext=this.characterLayer.getContext('2d');this.characterImage=this.characterContext.createImageData(this.characterLayer.width,this.characterLayer.height);
  this.characterPixels=new Uint32Array(this.characterImage.data.buffer);this.exiting=[];
 }
 remember(){this.exiting=[];for(let i=0;i<this.tiles.length;i++)if(this.tiles[i]>=0)this.exiting.push([i%this.cols*this.cw,Math.floor(i/this.cols)*this.ch,this.tiles[i]]);}
 plot(x,y,z,light,material){
  const col=Math.floor(x/this.cw),row=Math.floor(y/this.ch);if(col<0||row<0||col>=this.cols||row>=this.rows)return;
  const i=row*this.cols+col;if(z<this.depth[i])return;this.depth[i]=z;light=clamp(light);
  this.tiles[i]=(material*tones+Math.round(light*(tones-1)))*ramp.length+Math.max(1,Math.round(light*(ramp.length-1)));
 }
 buildWaterBackdrop(){
  const w=this.width,h=this.height,inset=w<600?6:12,top=16,floor=h*.91;
  this.waterBackdrop=document.createElement('canvas');this.waterBackdrop.width=this.canvas.width;this.waterBackdrop.height=this.canvas.height;
  const ctx=this.waterBackdrop.getContext('2d');ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
  const water=ctx.createLinearGradient(0,0,0,h);water.addColorStop(0,'#0a202c');water.addColorStop(.55,'#091a22');water.addColorStop(1,'#081317');
  ctx.fillStyle=water;ctx.fillRect(inset,top,w-inset*2,h-top-14);
  ctx.strokeStyle='rgba(126,180,190,.20)';ctx.lineWidth=.7;ctx.strokeRect(inset+.5,top+.5,w-inset*2-1,h-top-14);
  ctx.font='10px "Courier New", monospace';
  for(let i=0;i<480;i++){
    const x=inset+((i*137.17)%1000)/1000*(w-inset*2),y=floor+((i*37.9)%100)/100*(h-floor-17);
    ctx.fillStyle=i%5===0?'rgba(120,152,146,.26)':'rgba(88,126,128,.18)';ctx.fillText(i%4===0?':':'.',x,y);
  }
  // Quiet vertical light shafts, made of sparse type rather than a glow effect.
  ctx.fillStyle='rgba(98,165,187,.055)';
  for(let i=0;i<130;i++){const band=i%3,t=(i/3)/44;const x=w*(.15+band*.29)+t*w*.12+Math.sin(t*18)*8;ctx.fillText(':',x,top+36+t*h*.70);}
 }
 drawWater(time){
  const ctx=this.context,w=this.width,h=this.height,inset=w<600?6:12,top=16,floor=h*.91;
  ctx.drawImage(this.waterBackdrop,0,0,w,h);
  ctx.beginPath();for(let x=inset;x<w-inset;x+=8){const y=top+15+Math.sin(x*.016+time*.6)*1.4;if(x===inset)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle='rgba(150,203,205,.20)';ctx.lineWidth=.7;ctx.stroke();
  for(let i=0;i<26;i++){
    const rise=(i*.618034+time*(.022+(i%5)*.003))%1;
    const source=.09+((i*47)%89)/100,x=w*source+Math.sin(rise*9+i)*w*.009,y=floor-rise*(floor-top-24);
    ctx.font=`${6+i%5+rise*3}px "Courier New", monospace`;ctx.fillStyle=`rgba(145,208,217,${.12+(1-rise)*.15})`;ctx.fillText('o',x,y);
  }
 }
 draw(objects,time,{age=10,origin={x:.5,y:.5},still=false,yaw=0,pitch=0,aquarium=false}={}){
  const started=performance.now();
  const {context:ctx,width:w,height:h}=this,scale=Math.min(w,h),px=origin.x*w,py=origin.y*h,camera=rotation(pitch,yaw,0);
  ctx.fillStyle='#0c0f0e';ctx.fillRect(0,0,w,h);this.depth.fill(-Infinity);this.tiles.fill(-1);
  const inTank=aquarium&&objects.length;
  if(inTank){this.drawWater(time);ctx.save();ctx.beginPath();const inset=w<600?6:12;ctx.rect(inset,16,w-inset*2,h-30);ctx.clip();}
  const waterDone=performance.now();
  for(const object of objects){
   const orientation=object.model.orientation||[0,0,0],phase=object.phase||0,motion=object.motion;
   const swims=motion&&(motion.kind==='swim'||motion.kind==='glide');
   const bank=swims?Math.atan2(motion.v[1],Math.abs(motion.v[0])+.1)*.18:Math.sin(time*.18+phase)*.06;
   const local=rotation(orientation[0]+(motion?motion.tumble[0]:pitch)+Math.sin(time*.20+phase)*.06,orientation[1]+(motion?motion.tumble[1]:yaw)+(swims?motion.heading:Math.sin(time*.14+phase)*.08),orientation[2]+(object.anchored?0:bank));
   const m=motion?multiply(camera,local):local;
   const center=motion?[motion.p[0]*w/scale*.38,motion.p[1]*h/scale*.38,motion.p[2]*.80]:[0,0,0];
   const world=[camera[0]*center[0]+camera[1]*center[1]+camera[2]*center[2],camera[3]*center[0]+camera[4]*center[1]+camera[5]*center[2],camera[6]*center[0]+camera[7]*center[1]+camera[8]*center[2]];
   const joints=jointsFor(object.geometry.joints,time*.65+phase),data=object.geometry.points,size=object.size*scale,centerX=object.x*w,centerY=object.y*h;
   const hueBase=motion?motion.hue+time*.006+Math.sin(time*.08+phase)*.06:0;
   const atmosphere=clamp(.82+world[2]*.23,.5,1.04);
   const unfolding=age<2.6&&!still;
   const progress=clamp((age-(object.delay||0))/2.2);
   const travel=1-Math.exp(-7*progress)+Math.sin(progress*Math.PI)*.17;
   const curl=Math.sin(progress*Math.PI)*Math.exp(-3*progress)*scale*.16;
   const reveal=clamp(progress*8);
   for(let i=0;i<data.length;i+=STRIDE){
    let x=data[i],y=data[i+1],z=data[i+2],nx=data[i+3],ny=data[i+4],nz=data[i+5];const joint=data[i+8];
    if(joint){const {m:a,t}=joints[joint];const xx=a[0]*x+a[1]*y+a[2]*z+t[0],yy=a[3]*x+a[4]*y+a[5]*z+t[1];z=a[6]*x+a[7]*y+a[8]*z+t[2];x=xx;y=yy;const nn=a[0]*nx+a[1]*ny+a[2]*nz,nnY=a[3]*nx+a[4]*ny+a[5]*nz;nz=a[6]*nx+a[7]*ny+a[8]*nz;nx=nn;ny=nnY;}
    const xx=m[0]*x+m[1]*y+m[2]*z,yy=m[3]*x+m[4]*y+m[5]*z,zz=m[6]*x+m[7]*y+m[8]*z;
    let nX=m[0]*nx+m[1]*ny+m[2]*nz,nY=m[3]*nx+m[4]*ny+m[5]*nz,nZ=m[6]*nx+m[7]*ny+m[8]*nz;const flags=data[i+9];
    if(!(flags&3)&&nZ<-.12)continue;if((flags&1)&&nZ<0){nX=-nX;nY=-nY;nZ=-nZ;}
    const diffuse=Math.max(0,nX*-.42+nY*-.56+nZ*.714);
    // A small directional highlight reveals curvature without adding a glow.
    let light=(flags&2)?data[i+7]:(.44+.50*diffuse+.12*diffuse**12)*data[i+7];
    const depth=motion?world[2]+zz*object.size:zz;
    const perspective=motion?3.8/(3.8-depth):4.5/(4.5-zz);
    let tx=motion?w*.5+(world[0]+xx*object.size)*scale*perspective:centerX+xx*size*perspective;
    let ty=motion?h*.5+(world[1]+yy*object.size)*scale*perspective:centerY+yy*size*perspective;
    let material=data[i+6];
    if(motion){
      const hue=((hueBase+data[i+1]*.10+data[i+2]*.055+materialHue[material])%1+1)%1;
      light*=atmosphere*materialLight[material];
      material=(material===0||material===6?pearlStart:12)+Math.floor(hue*pigmentCount);
    }
    if(unfolding){tx=px+(tx-px)*travel+((i*13%97)/48-1)*curl;ty=py+(ty-py)*travel+((i*41%89)/44-1)*curl;light*=reveal;}
    this.plot(tx,ty,motion?depth*scale:zz*size+(object.z||0),light,material);
   }
   if(motion&&!object.anchored&&age>1.2)for(let i=0;i<3;i++){
    const a=phase+i*2.39996+time*.035,d=.12+(i%4)*.05;
    const wx=world[0]+Math.cos(a)*d,wy=world[1]+Math.sin(a*1.3)*d,wz=world[2]-.1+Math.sin(a)*.1,p=3.8/(3.8-wz);
    this.plot(w*.5+wx*scale*p,h*.5+wy*scale*p,wz*scale,.14+(i%3)*.035,12+Math.floor(((motion.hue+i*.011+time*.006)%1)*pigmentCount));
   }
  }
  if(objects.length&&age<2.2&&!still)for(let i=0;i<110;i++){const angle=i*2.39996,d=(1-Math.exp(-age*2))*(.1+(i%13)/17)*scale;this.plot(px+Math.cos(angle+age*.1)*d,py+Math.sin(angle+age*.1)*d,999,(1-age/2.2)*(.3+(i%7)/10),i%6);}
  const geometryDone=performance.now();
  this.paintCharacters();
  if(age<.65&&this.exiting.length&&!still){ctx.globalAlpha=1-age/.65;for(const [x,y,tile]of this.exiting){const dx=x-px,dy=y-py,d=Math.hypot(dx,dy)||1;this.paintTile(tile,x+dx/d*age*90,y+dy/d*age*90);}ctx.globalAlpha=1;}else this.exiting=[];
  if(inTank)ctx.restore();
  this.canvas.dataset.renderStages=[waterDone-started,geometryDone-waterDone,performance.now()-geometryDone].map(v=>v.toFixed(1)).join(',');
 }
 paintCharacters(){
  const pixels=this.characterPixels,tw=this.tw,th=this.th,stride=this.characterLayer.width;
  pixels.fill(0);
  for(let i=0;i<this.tiles.length;i++){
   const tile=this.tiles[i];if(tile<0)continue;
   const glyph=this.glyphPixels[tile],left=i%this.cols*tw,top=Math.floor(i/this.cols)*th;
   for(let y=0;y<th;y++){const dest=(top+y)*stride+left,source=y*tw;for(let x=0;x<tw;x++)pixels[dest+x]=glyph[source+x];}
  }
  this.characterContext.putImageData(this.characterImage,0,0);
  this.context.drawImage(this.characterLayer,0,0,this.width,this.rows*this.ch);
 }
 paintTile(tile,x,y){this.context.drawImage(this.atlas,tile%ramp.length*this.tw,Math.floor(tile/ramp.length)*this.th,this.tw,this.th,x,y,this.cw,this.ch);}
}
