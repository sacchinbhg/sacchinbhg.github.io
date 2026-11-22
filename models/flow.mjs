import {rng,TAU} from './geometry.mjs';

// A deterministic 3D wanderer: independent destinations and changing currents,
// with continuous steering and soft separation. There is no circular orbit force.
export class FlowWorld {
  constructor(seed,count=24,minimumSizes=[]){
    this.seed=seed;this.time=0;this.random=rng(seed);this.agents=[];
    const random=this.random;
    for(let i=0;i<count;i++){
      const spec=typeof minimumSizes[i]==='object'?minimumSizes[i]:{minSize:minimumSizes[i]||0};
      const kind=spec.kind||'swim';
      const radius=Math.min(spec.maxSize||.16,Math.max(spec.minSize||0,i===0?.145:.070+Math.pow(random(),1.7)*.040));
      let p=[0,0,0],best=-1;
      // Best-candidate sampling distributes forms before the simulation starts.
      for(let j=0;j<40;j++){
        const candidate=[(random()-.5)*1.90,(random()-.5)*1.45-.10,(random()-.5)*1.7];
        const perspective=3.8/(3.8-candidate[2]*.8);
        if((Math.max(Math.abs(candidate[0]),Math.abs(candidate[1]))*.38+radius*1.15)*perspective>.46)continue;
        const distance=i===0?1-candidate[0]**2-candidate[1]**2:Math.min(...this.agents.map(o=>{
          const p=3.8/(3.8-o.p[2]*.8);
          return ((o.p[0]*p-candidate[0]*perspective)**2+(o.p[1]*p-candidate[1]*perspective)**2)/((o.radius*p+radius*perspective)**2);
        }));
        if(distance>best){best=distance;p=candidate;}
      }
      p[1]=Math.min(p[1],.48);
      if(kind==='bottom')p=[(random()-.5)*1.65,.78+random()*.08,.1+random()*.35];
      const phase=random()*TAU;
      const speed=kind==='bottom'?.035+random()*.025:kind==='drift'?.055+random()*.045:kind==='glide'?.13+random()*.07:.22+random()*.14;
      this.agents.push({p,v:[0,0,0],phase,target:[0,0,0],nextTurn:0,turns:0,kind,heading:random()>.5?0:Math.PI,
        radius,hue:random(),spin:(random()-.5)*.12,
        tumble:[(random()-.5)*.12,(random()-.5)*.12,0],speed});
    }
    for(const agent of this.agents)this.chooseDestination(agent);
    this.forces=new Float64Array(count*3);
  }
  chooseDestination(agent){
    const random=this.random;let best=-1,target=[0,0,0];
    for(let i=0;i<12;i++){
      const z=agent.kind==='bottom'?.1+random()*.35:(random()-.5)*1.8;
      const perspective=3.8/(3.8-z*.8-agent.radius),limit=Math.max(.18,(.39/perspective-agent.radius*1.15)/.38);
      const candidate=[(random()-.5)*Math.min(limit,.90)*2,(random()-.5)*1.14-.10,z];
      if(agent.kind==='bottom'){candidate[0]=(random()-.5)*1.65;candidate[1]=(agent.floorY??.815)-.035+random()*.07;}
      if(agent.kind==='drift')candidate[1]=random()*.75-.60;
      const distance=Math.hypot(candidate[0]-agent.p[0],candidate[1]-agent.p[1],(candidate[2]-agent.p[2])*.7);
      // Prefer a real journey over a twitch around the current position.
      const score=(distance>.5&&distance<1.25?1:.35)+random();
      if(score>best){best=score;target=candidate;}
    }
    agent.target=target;agent.nextTurn=this.time+(agent.kind==='drift'?7:3.5)+random()*5;agent.turns++;
  }
  step(dt){
    dt=Math.min(Math.max(dt,0),1/30);this.time+=dt;
    const list=this.visibleCount===undefined?this.agents:this.agents.slice(0,this.visibleCount),t=this.time;
    const opening=Math.min(1,t/(this.openingDuration||.001)),pace=.18+.82*opening*opening*(3-2*opening);
    for(let i=0;i<list.length;i++){
      const a=list[i],[x,y,z]=a.p,p=a.phase;
      if(t>a.nextTurn||(opening===1&&Math.hypot(a.target[0]-x,a.target[1]-y,a.target[2]-z)<.20))this.chooseDestination(a);
      const dx=a.target[0]-x,dy=a.target[1]-y,dz=a.target[2]-z,d=Math.hypot(dx,dy,dz)||1;
      const surge=.85+.15*Math.sin(t*.63+p);
      // Goals change independently; low-frequency noise bends their paths gently.
      let vx=dx/d*a.speed*surge+.045*Math.sin(z*2+t*.43+p),
        vy=dy/d*a.speed*surge+.045*Math.cos(x*1.6-t*.37+p*1.3),
        vz=dz/d*a.speed*surge+.055*Math.sin(y*1.8+t*.35+p*.7);
      if(a.kind==='bottom'){vx=dx/d*a.speed;vy=dy*.3;vz=dz*.2;}
      if(a.kind==='drift'){vx*=.65;vy=dy/d*a.speed*.7+.013*Math.sin(t*.7+p);vz*=.55;}
      let sx=0,sy=0,sz=0,ax=0,ay=0,az=0,neighbors=0;
      for(let j=0;j<list.length;j++)if(i!==j){
        const b=list[j],dx=x-b.p[0],dy=y-b.p[1],dz=(z-b.p[2])*.35,d2=dx*dx+dy*dy+dz*dz;
        if(d2<.28){ax+=b.v[0];ay+=b.v[1];az+=b.v[2];neighbors++;}
        const space=(a.radius+b.radius)*2.65;
        if(d2<space*space&&d2>.000001){const d=Math.sqrt(d2),force=(1-d/space)*.34;sx+=dx/d*force;sy+=dy/d*force;sz+=dz/d*force;}
      }
      if(neighbors){vx=vx*.96+ax/neighbors*.04;vy=vy*.96+ay/neighbors*.04;vz=vz*.96+az/neighbors*.04;}
      const perspective=3.8/(3.8-z*.8-a.radius);
      const limit=(.43/perspective-a.radius*1.15)/.38;
      const wallX=Math.sign(x)*Math.max(0,Math.abs(x)-limit)*2.8;
      const ceiling=-Math.min(limit,.90),floor=a.kind==='bottom'?.88:Math.min(limit,.58);
      const wallY=y<ceiling?(y-ceiling)*2.8:y>floor?(y-floor)*2.8:0;
      const zEdge=Math.max(0,Math.abs(z)-.95)*.8;
      this.forces[i*3]=(vx+sx)*pace-wallX;
      this.forces[i*3+1]=(vy+(a.kind==='bottom'?0:sy))*pace-wallY;
      this.forces[i*3+2]=(vz+sz)*pace-Math.sign(z)*zEdge;
    }
    const blend=1-Math.exp(-dt*1.5);
    for(let i=0;i<list.length;i++){
      const a=list[i];for(let k=0;k<3;k++){a.v[k]+=(this.forces[i*3+k]-a.v[k])*blend;a.p[k]+=a.v[k]*dt;}
      if((a.kind==='swim'||a.kind==='glide')&&Math.abs(a.v[0])>.015){
        const target=(a.v[0]>0?0:Math.PI)-Math.atan2(a.v[2],Math.abs(a.v[0]))*.25;
        const delta=Math.atan2(Math.sin(target-a.heading),Math.cos(target-a.heading));
        a.heading+=delta*(1-Math.exp(-dt*2.2));
      }
    }
  }
}
