import {rng,STRIDE,rotationMatrix} from './geometry.mjs';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

export function createHabitat(models,seed,width,height,geometry){
  const mobile=width<600,scale=Math.min(width,height),random=rng(seed+17);
  // Tall growth frames the tank; lower central pieces leave distinct reef pockets.
  const placements=mobile?[[.06,.22,4],[.22,.13,0],[.41,.09,6],[.73,.13,3],[.95,.24,5],[.88,.16,1]]:
    [[.04,.23,4],[.13,.17,0],[.24,.12,2],[.40,.10,6],[.59,.10,7],[.79,.15,3],[.89,.20,1],[.97,.24,5]];
  return placements.map(([x,size,index],i)=>{
    const model=models[index],shape=geometry(model,.65),z=-.25+random()*.20,perspective=3.8/(3.8-z*.8);
    let root=0;for(let p=1;p<shape.points.length;p+=STRIDE)root=Math.max(root,shape.points[p]);
    const y=(.91-.5)/perspective/.38-size*root*scale/height/.38;
    return {model,geometry:shape,size,anchored:true,x:.5,y:.5,phase:i,
      motion:{p:[(x-.5)/perspective/.38,y,z],v:[0,0,0],kind:'habitat',heading:0,tumble:[0,0,0],hue:(.28+i*.13)%1,phase:i},delay:0};
  });
}

// Measure the silhouette in its opening pose. World-space circles overestimate
// thin fish, underestimate tall jellyfish, and ignore the viewport's aspect ratio.
export function silhouette(object,time=0){
  const o=object.model.orientation||[0,0,0],a=object.motion,phase=object.phase||0;
  const swims=a.kind==='swim'||a.kind==='glide';
  const m=rotationMatrix(o[0]+a.tumble[0]+Math.sin(time*.20+phase)*.06,
    o[1]+a.tumble[1]+(swims?a.heading:Math.sin(time*.14+phase)*.08),
    o[2]+(object.anchored||swims?0:Math.sin(time*.18+phase)*.06));
  const bounds={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity,front:-Infinity};
  const data=object.geometry.points;
  for(let i=0;i<data.length;i+=STRIDE){
    const x=m[0]*data[i]+m[1]*data[i+1]+m[2]*data[i+2],
      y=m[3]*data[i]+m[4]*data[i+1]+m[5]*data[i+2],
      z=m[6]*data[i]+m[7]*data[i+1]+m[8]*data[i+2];
    bounds.left=Math.min(bounds.left,x);bounds.right=Math.max(bounds.right,x);
    bounds.top=Math.min(bounds.top,y);bounds.bottom=Math.max(bounds.bottom,y);bounds.front=Math.max(bounds.front,z);
  }
  return bounds;
}

export function projectFootprint(object,shape,width,height,position=object.motion.p){
  const size=object.size*Math.min(width,height),perspective=3.8/(3.8-position[2]*.8);
  const front=3.8/(3.8-position[2]*.8-shape.front*object.size);
  const x=width*(.5+position[0]*.38*perspective),y=height*(.5+position[1]*.38*perspective);
  // Include a small allowance for joint articulation and perspective across the body.
  const pad=Math.max(4,size*.09);
  return {left:x+shape.left*size*front-pad,right:x+shape.right*size*front+pad,
    top:y+shape.top*size*front-pad,bottom:y+shape.bottom*size*front+pad};
}

function clearance(a,b){
  const dx=Math.max(a.left-b.right,b.left-a.right),dy=Math.max(a.top-b.bottom,b.top-a.bottom);
  return dx>0||dy>0?Math.hypot(Math.max(0,dx),Math.max(0,dy)):Math.max(dx,dy);
}

// Place the actual visible group, not the nine hidden desktop fish on a phone.
// Focal animals occupy opposing thirds; remaining silhouettes fill open water.
// Random depth, small positional variations, and colours keep every opening new.
export function composeAquarium(world,objects,habitat,width,height,time=0){
  const random=rng(world.seed^0x517cc1b7),portrait=width<height,scale=Math.min(width,height);
  const first=objects.find(o=>o.motion.kind==='glide')||objects.find(o=>o.motion.kind!=='bottom');
  const second=objects.find(o=>o!==first&&/jellyfish|nettle/.test(o.model.id))||objects.find(o=>o!==first&&o.motion.kind!=='bottom');
  const focal=new Map();
  if(first)focal.set(first,portrait?[.34,.29]:[.32,.38]);
  if(second)focal.set(second,portrait?[.68,.48]:[.70,.27]);
  const flip=random()>.5;
  if(flip)for(const point of focal.values())point[0]=1-point[0];
  for(const object of objects){
    const a=object.motion,isFocal=focal.has(object),sizeFactor=object.size/a.radius;
    if(isFocal){a.radius=object.model.maxSize||a.radius;object.size=a.radius*sizeFactor;}
    a.p[2]=a.kind==='bottom'?.40+random()*.12:isFocal?.42+random()*.20:-.78+random()*.98;
    const side=focal.get(object)?.[0]??random();
    a.heading=side<.5?0:Math.PI;
  }
  const shapes=new Map(objects.map(o=>[o,silhouette(o,time)]));
  const reefs=habitat.map(o=>projectFootprint(o,silhouette(o,time),width,height));
  const area=o=>{const b=shapes.get(o);return(b.right-b.left)*(b.bottom-b.top)*o.size*o.size;};
  const ordered=[...objects].sort((a,b)=>Number(focal.has(b))-Number(focal.has(a))||area(b)-area(a));
  const placed=[],floor=height*.91,inset=width<600?6:12;
  for(const object of ordered){
    const a=object.motion,shape=shapes.get(object),anchor=focal.get(object),bottom=a.kind==='bottom';
    const perspective=3.8/(3.8-a.p[2]*.8),front=3.8/(3.8-a.p[2]*.8-shape.front*object.size);
    const offsetX=(shape.left+shape.right)*.5*object.size*scale*front;
    const offsetY=(shape.top+shape.bottom)*.5*object.size*scale*front;
    let best=-Infinity,winner=null;
    for(let i=0;i<420;i++){
      let x,y;
      if(anchor&&i<260){x=anchor[0]+(random()-.5)*.15;y=anchor[1]+(random()-.5)*.13;}
      else{x=.085+random()*.83;y=.14+random()*(bottom?.05:.53);}
      const px=(x*width-offsetX-width*.5)/(width*.38*perspective);
      const py=bottom?clamp((floor-shape.bottom*object.size*scale*front-height*.5-6)/(height*.38*perspective),.62,.88):
        (y*height-offsetY-height*.5)/(height*.38*perspective);
      const limit=(.43/perspective-a.radius*1.15)/.38;
      if(Math.abs(px)>limit||(!bottom&&(py< -Math.min(limit,.90)||py>Math.min(limit,.58))))continue;
      const position=[px,py,a.p[2]],box=projectFootprint(object,shape,width,height,position);
      if(box.left<inset+12||box.right>width-inset-12||box.top<48||box.bottom>height-22)continue;
      let score=0,nearest=Infinity;
      for(const other of placed){const gap=clearance(box,other);nearest=Math.min(nearest,gap);if(gap<8)score-=(8-gap)*4;}
      for(const reef of reefs){const gap=clearance(box,reef);nearest=Math.min(nearest,gap);if(gap<4)score-=(4-gap)*(bottom?1.8:3);}
      score+=Math.min(nearest,28)*.12;
      if(!bottom&&((Math.cos(a.heading)>0&&px>.6)||(Math.cos(a.heading)<0&&px<-.6)))score-=6;
      if(anchor)score-=Math.hypot((x-anchor[0])*width,(y-anchor[1])*height)*.055;
      else if(!bottom)score-=Math.abs(y-(portrait?.40:.38))*.9;
      score+=random()*.4;
      if(score>best){best=score;winner={position,box};}
    }
    if(winner){a.p=winner.position;placed.push(winner.box);}
    a.v=[0,0,0];
    if(bottom)a.floorY=a.p[1];
    // Begin in the direction the animal already faces, with no edge-on flip.
    const direction=Math.cos(a.heading)>0?1:-1;
    a.target=[clamp(a.p[0]+direction*.48,-.94,.94),bottom?a.p[1]:clamp(a.p[1]+(random()-.5)*.22,-.68,.50),
      clamp(a.p[2]+(random()-.5)*.30,-.9,.8)];
    a.nextTurn=7+random()*4;
  }
  world.visibleCount=objects.length;world.openingDuration=7;
  return placed;
}
