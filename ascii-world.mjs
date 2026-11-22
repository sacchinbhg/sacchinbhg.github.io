// Small infinities: an original ASCII aquarium, with independently swimming creatures.
import {AQUARIUM_MODELS as MODELS,AQUARIUM_BY_ID as MODEL_BY_ID,HABITAT_MODELS} from './models/aquarium-catalog.mjs';
import {rng} from './models/geometry.mjs';
import {FlowWorld} from './models/flow.mjs';
import {AsciiRenderer} from './models/renderer.mjs';
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
export {MODELS};

export function mountWorld(){
  const $=id=>document.getElementById(id),canvas=$('ascii-world'),trigger=$('art-trigger');
  const renderer=new AsciiRenderer(canvas);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),params=new URLSearchParams(location.search);
  let selected=MODEL_BY_ID.has(params.get('specimen'))?params.get('specimen'):null;
  let width=1,height=1,objects=[],habitat=[],chosen=[],world=null,seed=1,generation=0;
  let yaw=0,pitch=0,origin={x:.5,y:.5},clock=0,born=0,last=null,lastPaint=-Infinity,raf=0,accumulator=0,renderAverage=0;
  let paused=reduced.matches||params.get('paused')==='1',drag=null,suppressClick=false;
  const cache=new Map();
  const first=['clownfish','green-sea-turtle','moon-jellyfish','angelfish','manta-ray','crab','tang','betta','seahorse','pufferfish','starfish','moorish-idol','lionfish','neon-tetra','hermit-crab','hammerhead-shark','discus','guppy','koi','shrimp','squid','lionhead-goldfish','lobster','longhorn-cowfish'];
  function pickModels(){
    if(selected)return Array.from({length:24},()=>MODEL_BY_ID.get(selected));
    if(generation===0)return first.map(id=>MODEL_BY_ID.get(id));
    const random=rng(seed),shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;};
    const swimmers=shuffle(MODELS.filter(m=>m.kind!=='bottom')).slice(0,20),bottom=shuffle(MODELS.filter(m=>m.kind==='bottom')).slice(0,4);
    for(const index of [5,10,14,22])swimmers.splice(index,0,bottom.shift());
    return swimmers;
  }

  function geometry(model,quality){
    const key=model.id+':'+quality;
    if(!cache.has(key)){
      if(cache.size>=64)cache.delete(cache.keys().next().value);
      cache.set(key,model.build(41,quality));
    }
    return cache.get(key);
  }
  function layout(){
    if(!world)return;
    const mobile=width<600,count=mobile?15:24;
    objects=world.agents.slice(0,count).map((motion,i)=>{
      const model=chosen[i];
      return {model,geometry:geometry(model,i===0?1.05:motion.radius>.11?.8:.65),motion,phase:motion.phase,
        size:motion.radius*(mobile?1.04:1),x:.5,y:.5,delay:i*.014};
    });
    const placements=mobile?[[.08,.22,4],[.27,.12,0],[.45,.11,6],[.65,.17,3],[.83,.24,5],[.93,.16,1]]:
      [[.05,.23,4],[.17,.17,0],[.29,.13,2],[.43,.12,6],[.58,.14,7],[.70,.17,3],[.83,.20,1],[.96,.24,5]];
    const scale=Math.min(width,height),random=rng(seed+17);
    habitat=placements.map(([x,size,index],i)=>{
      const model=HABITAT_MODELS[index],shape=geometry(model,.65),z=-.25+random()*.20,perspective=3.8/(3.8-z*.8);
      let root=0;for(let p=1;p<shape.points.length;p+=10)root=Math.max(root,shape.points[p]);
      const y=(.91-.5)/perspective/.38-size*root*scale/height/.38;
      return {model,geometry:shape,size,anchored:true,x:.5,y:.5,phase:i,
        motion:{p:[(x-.5)/perspective/.38,y,z],v:[0,0,0],kind:'habitat',heading:0,tumble:[0,0,0],hue:(.28+i*.13)%1,phase:i},delay:0};
    });
  }
  function draw(){
    const start=performance.now();
    renderer.draw([...habitat,...objects],clock,{age:clock-born,origin,still:reduced.matches,yaw,pitch,aquarium:true});
    canvas.dataset.phase=objects.length?(clock-born<2.6&&!reduced.matches?'unfolding':'settled'):'empty';
    canvas.dataset.time=clock.toFixed(2);canvas.dataset.count=String(objects.length);
    canvas.dataset.subjects=[...new Set(objects.map(o=>o.model.id))].join(',');
    renderAverage=renderAverage*.9+(performance.now()-start)*.1;
    canvas.dataset.renderMs=renderAverage.toFixed(1);
    if(world)canvas.dataset.position=world.agents[0].p.map(n=>n.toFixed(3)).join(',');
  }
  function sync(){
    $('art-pause').textContent=paused?'Resume':'Pause';canvas.dataset.paused=String(paused);
    $('art-tools').hidden=!objects.length;
    $('world-title').textContent='Small infinities';
    $('art-hint').textContent=objects.length?'Click to reshuffle · drag to look around':'Click anywhere. Let it unfold.';
    trigger.setAttribute('aria-label',objects.length?'Create a new ASCII aquarium. Drag or use arrow keys to look around.':'Create an original ASCII aquarium');
  }
  function frame(now){
    raf=0;
    if(document.hidden||paused||!world){last=null;return;}
    if(last!==null)accumulator+=Math.min((now-last)/1000,.10);
    last=now;
    // Fixed simulation steps keep trajectories independent of the display rate.
    while(accumulator>=1/60){world.step(1/60);clock+=1/60;accumulator-=1/60;}
    if(now-lastPaint>=1000/30-.5){draw();lastPaint=now;}
    schedule();
  }
  function schedule(){if(!raf&&!paused&&!document.hidden&&world)raf=requestAnimationFrame(frame);}
  function stop(){cancelAnimationFrame(raf);raf=0;last=null;accumulator=0;}
  function create(x=.5,y=.5,instant=false){
    renderer.remember();
    const entropy=new Uint32Array(1);crypto.getRandomValues(entropy);seed=entropy[0];
    if(generation===0&&/^\d+$/.test(params.get('seed')||''))seed=Number(params.get('seed'))>>>0;
    chosen=pickModels();world=new FlowWorld(seed,24,chosen);generation++;layout();
    origin={x:clamp(x),y:clamp(y)};born=clock-(instant||reduced.matches||paused?3:0);
    canvas.dataset.generation=String(generation);canvas.dataset.seed=String(seed);
    $('art-invitation').hidden=true;
    $('art-status').textContent=`A colourful aquarium with ${objects.length} creatures, coral, plants, and rising bubbles. Fish swim independently, jellyfish drift, and bottom-dwellers explore the reef. Drag or use arrow keys to look around.`;
    sync();draw();schedule();
  }
  function clear(){
    clearTimeout(introduction);world=null;objects=[];habitat=[];renderer.exiting=[];stop();
    $('art-invitation').hidden=false;$('art-status').textContent='The canvas is empty. Click or press Enter to create a new aquarium.';
    sync();draw();trigger.focus({preventScroll:true});
  }
  function resize(){
    const rect=trigger.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    renderer.resize(width,height,devicePixelRatio||1,width<600?2.8:3.6);
    if(world)layout();draw();
  }
  trigger.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;suppressClick=false;
    drag={x:event.clientX,y:event.clientY,yaw,pitch,moved:false};trigger.setPointerCapture(event.pointerId);
  });
  trigger.addEventListener('pointermove',event=>{
    if(!drag||!world)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(Math.hypot(dx,dy)>5)drag.moved=true;
    if(drag.moved){yaw=clamp(drag.yaw+dx*.002,-.55,.55);pitch=clamp(drag.pitch-dy*.002,-.25,.25);trigger.classList.add('is-turning');draw();}
  });
  trigger.addEventListener('pointerup',()=>{suppressClick=!!drag?.moved;drag=null;trigger.classList.remove('is-turning');});
  trigger.addEventListener('pointercancel',()=>{drag=null;suppressClick=true;trigger.classList.remove('is-turning');});
  trigger.addEventListener('click',event=>{
    if(suppressClick){suppressClick=false;return;}clearTimeout(introduction);
    const rect=trigger.getBoundingClientRect(),keyboard=event.detail===0;
    create(keyboard ? .5 : (event.clientX-rect.left)/rect.width,keyboard ? .5 : (event.clientY-rect.top)/rect.height,keyboard);
  });
  trigger.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
    event.preventDefault();if(event.key==='Home'){yaw=0;pitch=0;}
    else if(event.key==='ArrowLeft')yaw=clamp(yaw-.08,-.55,.55);else if(event.key==='ArrowRight')yaw=clamp(yaw+.08,-.55,.55);
    else pitch=clamp(pitch+(event.key==='ArrowUp' ? .06 : -.06),-.25,.25);draw();
  });
  $('art-pause').addEventListener('click',()=>{paused=!paused;stop();sync();schedule();$('art-status').textContent=paused?'The current is still.':'The current is moving.';});
  $('art-clear').addEventListener('click',clear);
  document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden)schedule();});
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;born=clock-3;stop();sync();draw();}});
  new ResizeObserver(resize).observe(trigger);trigger.disabled=false;resize();sync();
  const introduction=setTimeout(()=>{if(!world&&generation===0)create(.5,.5,reduced.matches);},900);
  return {clear};
}
