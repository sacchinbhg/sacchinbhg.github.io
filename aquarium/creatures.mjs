import * as THREE from '../vendor/three/three.module.js';

const TAU=Math.PI*2;
const sphere=new THREE.SphereGeometry(1,24,16);
const palette=['#ef8e64','#71d1cb','#e5bf68','#a898dc','#dc86ab','#83b79b'];
const white=new THREE.MeshStandardMaterial({color:'#e9e2bc',roughness:.48});
const black=new THREE.MeshStandardMaterial({color:'#071820',roughness:.25});
const lightEye=new THREE.MeshBasicMaterial({color:'#e2f4eb'});

export function material(color,extra={}){
  return new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.08,...extra});
}
function ellipsoid(parent,position,scale,mat){
  const mesh=new THREE.Mesh(sphere,mat);mesh.position.set(...position);mesh.scale.set(...scale);
  parent.add(mesh);return mesh;
}
export function surface(fn,rows=36,cols=28){
  const positions=[],uv=[],indices=[];
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){positions.push(...fn(i/rows,j/cols));uv.push(i/rows,j/cols);}
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
    const a=i*(cols+1)+j,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
export function tube(parent,points,radius,mat,segments=28){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,6,false),mat);parent.add(mesh);return mesh;
}
function curve(parent,fn,radius,mat,segments=24){
  return tube(parent,Array.from({length:segments+1},(_,i)=>fn(i/segments)),radius,mat,segments);
}
function eye(parent,x,y,z,size=.07){
  for(const side of [-1,1]){
    ellipsoid(parent,[x,y,z*side],[size*1.3,size*1.3,size*.5],white);
    ellipsoid(parent,[x+.012,y,z*side+size*.36*side],[size*.86,size*.9,size*.3],black);
    ellipsoid(parent,[x+.027,y+.025,z*side+size*.64*side],[size*.25,size*.25,size*.12],lightEye);
  }
}
function fin(parent,points,mat,ribs=7){
  const shape=new THREE.Shape();shape.moveTo(...points[0]);
  for(let i=1;i<points.length;i++)shape.lineTo(...points[i]);shape.closePath();
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat);parent.add(mesh);
  const ribMaterial=material(mat.color.clone().multiplyScalar(.58),{roughness:.6});
  const start=points[0],a=points[1],b=points[2];
  for(let i=1;i<ribs;i++){
    const t=i/ribs;curve(parent,s=>[start[0]+(a[0]*(1-t)+b[0]*t-start[0])*s,start[1]+(a[1]*(1-t)+b[1]*t-start[1])*s,.008],.007,ribMaterial,5);
  }
  return mesh;
}
function fishTexture(kind,color){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const c=canvas.getContext('2d');c.fillStyle=color;c.fillRect(0,0,512,256);
  const glow=c.createLinearGradient(0,0,0,256);glow.addColorStop(0,'#ffffff40');glow.addColorStop(.5,'#ffffff00');glow.addColorStop(1,'#07182a68');c.fillStyle=glow;c.fillRect(0,0,512,256);
  if(kind==='clownfish'){
    for(const x of [100,257,414]){c.fillStyle='#17242a';c.fillRect(x-9,0,47,256);c.fillStyle='#f3e6cc';c.fillRect(x,0,29,256);}
  }else if(kind==='angelfish'){
    c.fillStyle='#152b3b';for(const x of [120,245,365])c.fillRect(x,0,29,256);
  }else if(kind==='neon'){
    c.fillStyle='#68f0e9';c.fillRect(0,43,512,28);c.fillRect(0,169,512,28);
    c.fillStyle='#e46d92';c.fillRect(245,80,267,80);
  }
  c.lineWidth=1;c.strokeStyle='#ffffff26';
  for(let y=0;y<280;y+=14)for(let x=-15;x<530;x+=18){c.beginPath();c.arc(x+(y%28?9:0),y,10,.15,2.5);c.stroke();}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
export function makeFish(kind='reef',color=palette[0]){
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);
  const tall=kind==='angelfish',slim=kind==='neon',height=tall?.77:slim?.23:.42,depth=tall?.20:.28;
  const bodyMat=material('#ffffff',{map:fishTexture(kind,color),side:THREE.DoubleSide});
  const body=new THREE.Mesh(surface((u,v)=>{
    const radius=Math.pow(Math.sin(u*Math.PI),.72),angle=v*TAU;
    return [1.05-u*1.9,radius*Math.cos(angle)*height,radius*Math.sin(angle)*depth];
  },48,32),bodyMat);rig.add(body);
  const finMat=material(color,{side:THREE.DoubleSide,roughness:.65});
  const tail=new THREE.Group();tail.position.x=-.8;rig.add(tail);
  fin(tail,[[0,0],[-.69,tall?.64:.52],[-.52,0],[-.69,tall?-.64:-.52]],finMat,9);
  const dorsal=new THREE.Group();rig.add(dorsal);
  fin(dorsal,[[.63,height*.62],[-.67,height*.64],[-.57,tall?1.52:height+.40],[.25,height+.15]],finMat,8);
  fin(rig,[[.35,-height*.65],[-.66,-height*.60],[-.53,tall?-1.40:-height-.22]],finMat,6);
  const pectoral=new THREE.Group();pectoral.position.set(.27,-height*.2,depth*.92);rig.add(pectoral);
  fin(pectoral,[[0,0],[-.54,-.36],[-.38,.10]],finMat,5);
  eye(rig,.68,.10,depth*.70,slim?.045:.07);
  curve(rig,t=>[.79+t*.21,-.028-.016*Math.sin(t*Math.PI),.10],.012,black,8);
  curve(rig,t=>[.39-Math.sin(t*Math.PI)*.07,(t-.5)*height*1.5,depth*Math.sqrt(Math.max(0,1-Math.pow((t-.5)*1.4,2)))+.005],.012,material('#34524c'),12);
  return {root,kind:'swim',update(t){tail.rotation.y=Math.sin(t*3.1)*.34;pectoral.rotation.y=Math.sin(t*3.1+.8)*.45;rig.rotation.z=Math.sin(t*.7)*.035;}};
}

function shellTexture(){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const c=canvas.getContext('2d');
  c.fillStyle='#afaf67';c.fillRect(0,0,512,256);
  for(let y=-25,row=0;y<300;y+=46,row++)for(let x=-30;x<550;x+=58){
    const cx=x+(row%2?29:0);c.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6;c.lineTo(cx+32*Math.cos(a),y+27*Math.sin(a));}c.closePath();
    c.fillStyle=['#789579','#a2aa68','#c0ad66','#8eaa77'][(row+Math.floor((x+30)/58))%4];c.fill();
    c.strokeStyle='#334c40';c.lineWidth=4;c.stroke();c.strokeStyle='#cfcc8d';c.lineWidth=1;c.stroke();
    for(let k=0;k<5;k++){c.beginPath();c.ellipse(cx,y,8+k*3,6+k*2,0,0,TAU);c.strokeStyle='#414d3228';c.stroke();}
  }
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;
}
export function makeTurtle(){
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);rig.rotation.x=.42;
  const skin=material('#aebd84',{roughness:.68}),shell=material('#ffffff',{map:shellTexture(),roughness:.57});
  ellipsoid(rig,[0,-.12,0],[1.05,.26,.75],material('#b9ac72'));
  ellipsoid(rig,[-.1,.04,0],[1.08,.47,.80],shell);
  ellipsoid(rig,[1.09,.02,0],[.45,.25,.28],skin);ellipsoid(rig,[.85,-.02,0],[.4,.2,.23],skin);
  eye(rig,1.29,.10,.21,.064);
  curve(rig,t=>[1.27+t*.25,-.07,.21-.08*t],.014,material('#455849'),10);
  const flippers=[];
  for(const side of [-1,1])for(const front of [true,false]){
    const group=new THREE.Group();group.position.set(front?.56:-.78,-.12,side*.53);rig.add(group);
    const paddle=ellipsoid(group,[front?-.08:-.2,-.07,side*(front?.52:.27)],[front?.25:.25,.065,front?.8:.42],skin);
    paddle.rotation.y=side*(front?.44:-.55);paddle.rotation.x=side*.13;
    for(let i=0;i<5;i++){
      const z=side*(.20+i*.12);curve(group,t=>[-.24+t*.30,-.004,z+.04*Math.sin(t*Math.PI)],.009,material('#687c53'),8);
    }
    flippers.push({group,side,front});
  }
  const tail=ellipsoid(rig,[-1.14,-.10,0],[.3,.07,.09],skin);tail.rotation.z=.1;
  return {root,kind:'glide',update(t){for(const f of flippers)f.group.rotation.x=f.side*Math.sin(t*1.05+(f.front?0:1))*(f.front?.27:.15);rig.rotation.z=Math.sin(t*.5)*.06;}};
}

export function makeRay(){
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);rig.rotation.x=.52;
  const geo=surface((u,v)=>{
    const z=(v-.5)*3.7,span=Math.abs(z)/1.85,width=.77*(1-Math.pow(span,1.3))+.055;
    const x=(u-.5)*width*2+.28*span;
    return [x,.09*Math.sin(u*Math.PI)*(1-span)-.12*span,z];
  },36,48);
  const rayMat=material('#809aca',{side:THREE.DoubleSide,roughness:.38});
  const body=new THREE.Mesh(geo,rayMat);rig.add(body);
  const base=geo.attributes.position.array.slice();
  ellipsoid(rig,[.13,.06,0],[.7,.17,.31],rayMat);eye(rig,.48,.17,.23,.045);
  const tail=curve(rig,t=>[-.6-t*2.3,.02+.13*Math.sin(t*2),.12*Math.sin(t*3)],.025,rayMat,40);
  for(const side of [-1,1])curve(rig,t=>[.6+.28*t,.02,side*(.15+.16*Math.sin(t*Math.PI))],.055,rayMat,14);
  return {root,kind:'glide',update(t){
    const a=geo.attributes.position.array;
    for(let i=0;i<a.length;i+=3){const wing=Math.abs(base[i+2])/1.85;a[i+1]=base[i+1]+Math.sin(t*1.05-wing*2)*wing*wing*.48;}
    geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();tail.rotation.x=Math.sin(t*.6)*.13;
  }};
}

export function makeJelly(color='#de9ace'){
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);
  const bellMat=material(color,{transparent:true,opacity:.67,side:THREE.DoubleSide,roughness:.28,metalness:.12,emissive:color,emissiveIntensity:.18,depthWrite:false});
  const bell=new THREE.Mesh(surface((u,v)=>{
    const theta=u*Math.PI*.57,angle=v*TAU,r=Math.sin(theta)*.74*(1+.026*Math.sin(angle*20)*u*u);
    return [Math.cos(angle)*r,Math.cos(theta)*.62,Math.sin(angle)*r];
  },30,64),bellMat);rig.add(bell);
  const luminous=material(color,{emissive:color,emissiveIntensity:.65,roughness:.45});
  curve(rig,t=>[Math.cos(t*TAU)*.72,-.13+Math.sin(t*TAU*20)*.018,Math.sin(t*TAU)*.72],.017,luminous,120);
  for(let i=0;i<16;i++)curve(rig,t=>{
    const theta=t*Math.PI*.55,a=i*TAU/16;return [Math.cos(a)*Math.sin(theta)*.745,Math.cos(theta)*.625,Math.sin(a)*Math.sin(theta)*.745];
  },.009,luminous,20);
  for(let i=0;i<4;i++){const a=i*TAU/4;ellipsoid(rig,[Math.cos(a)*.20,.04,Math.sin(a)*.20],[.16,.07,.14],luminous);}
  const tendrils=[];
  for(let i=0;i<14;i++){
    const a=i*TAU/14,length=1.25+(i%4)*.23,r=i%3===0?.22:.55;
    const strand=curve(rig,t=>[Math.cos(a)*r+Math.sin(t*7+a)*.09*t,-.14-t*length,Math.sin(a)*r+Math.cos(t*8+a)*.06*t],i%3===0?.025:.010,luminous,32);
    const original=strand.geometry.attributes.position.array.slice();tendrils.push({strand,original,a});
  }
  return {root,kind:'drift',update(t){
    const pulse=Math.sin(t*1.5);bell.scale.set(1+pulse*.045,1-pulse*.07,1+pulse*.045);
    for(const {strand,original,a}of tendrils){const p=strand.geometry.attributes.position.array;
      for(let i=0;i<p.length;i+=3){const depth=Math.max(0,-original[i+1]);p[i]=original[i]+Math.sin(t*1.2+depth*3+a)*depth*.055;p[i+2]=original[i+2]+Math.cos(t*.9+depth*3+a)*depth*.035;}
      strand.geometry.attributes.position.needsUpdate=true;
    }
  }};
}

export function makeHabitat(random){
  const root=new THREE.Group(),sway=[];
  const stoneMat=material('#213e49',{roughness:.98});
  for(let i=0;i<16;i++){
    const x=(i<8?-1:1)*(4.4+random()*4.7),z=-3+random()*6;
    ellipsoid(root,[x,-4.22+random()*.14,z],[.5+random()*.8,.25+random()*.5,.5+random()*.6],stoneMat);
  }
  // Ribbon-shaped kelp, growing from a shared root and tapering at every tip.
  for(let i=0;i<22;i++){
    const side=i<13?-1:1,x=side*(6.2+random()*2),z=-3+random()*3.4,height=2+random()*4;
    const geo=surface((u,v)=>[Math.sin(u*4+i)*u*.40+(v-.5)*.30*Math.pow(Math.sin(Math.PI*u),.45),u*height,Math.sin(u*8+i)*u*.20],32,4);
    const mesh=new THREE.Mesh(geo,material(i%3===0?'#b2b76c':'#498b78',{side:THREE.DoubleSide,roughness:.75}));
    mesh.position.set(x,-4.1,z);mesh.rotation.z=side*(.02+random()*.15);root.add(mesh);sway.push({mesh,phase:i,base:mesh.rotation.z});
  }
  // Forked sea fans and branched coral use real tubes, with progressively finer tips.
  function branch(group,start,direction,length,radius,depth,mat){
    const end=start.map((v,i)=>v+direction[i]*length),mid=start.map((v,i)=>(v+end[i])*.5+(i===2?(random()-.5)*.15:0));
    tube(group,[start,mid,end],radius,mat,8);
    if(!depth)return;
    for(const sign of [-1,1]){
      const d=new THREE.Vector3(direction[0]+sign*(.35+random()*.26),direction[1]*.86,direction[2]+(random()-.5)*.25).normalize();
      branch(group,end,d.toArray(),length*(.60+random()*.10),radius*.66,depth-1,mat);
    }
  }
  for(const [x,z,size,color]of [[6.3,-.8,1.3,'#c47d9f'],[4.9,1.7,.75,'#e19c75'],[-5,1.6,.85,'#b599cd'],[-7,-1,.7,'#74bdb3']]){
    const group=new THREE.Group();group.position.set(x,-4.1,z);group.scale.setScalar(size);root.add(group);
    branch(group,[0,0,0],[0,1,0],.8,.075,5,material(color,{roughness:.75}));
    sway.push({mesh:group,phase:x,base:0});
  }
  // Small anemones keep the center low and leave the swimming space open.
  const anemoneMat=material('#d49b7b',{roughness:.65});
  for(const [x,z]of [[-2.8,1.7],[3.1,2.2],[6.8,2]])for(let i=0;i<16;i++){
    const a=i*2.399,r=.12*Math.sqrt(i),h=.25+random()*.55;
    curve(root,t=>[x+Math.cos(a)*(r+t*.18),-4.18+t*h,z+Math.sin(a)*(r+t*.18)],.035,anemoneMat,10);
  }
  return {root,update(t){for(const s of sway)s.mesh.rotation.z=s.base+Math.sin(t*.45+s.phase)*.026;}};
}

export function disposeTree(root){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  root.traverse(object=>{if(object.geometry&&object.geometry!==sphere)geometries.add(object.geometry);if(object.material){for(const mat of Array.isArray(object.material)?object.material:[object.material])if(![white,black,lightEye].includes(mat))materials.add(mat);}});
  for(const mat of materials){if(mat.map)textures.add(mat.map);mat.dispose();}for(const tex of textures)tex.dispose();for(const geometry of geometries)geometry.dispose();
}
