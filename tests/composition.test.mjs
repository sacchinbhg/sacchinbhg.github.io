import assert from 'node:assert/strict';
import test from 'node:test';
import {AQUARIUM_MODELS,AQUARIUM_BY_ID,HABITAT_MODELS,INITIAL_SUBJECTS} from '../models/aquarium-catalog.mjs';
import {FlowWorld} from '../models/flow.mjs';
import {composeAquarium,createHabitat,silhouette,projectFootprint} from '../models/composition.mjs';
import {rng} from '../models/geometry.mjs';

const VIEWPORTS=[[320,370],[390,640],[1280,560],[1440,780],[844,260]];
const INITIAL=INITIAL_SUBJECTS.map(id=>{
  const model=AQUARIUM_BY_ID.get(id);
  assert.ok(model,`Initial subject ${id} exists in the aquarium catalog.`);
  return model;
});
const cache=new Map();
function geometry(model,quality){
  const key=`${model.id}:${quality}`;
  if(!cache.has(key))cache.set(key,model.build(41,quality));
  return cache.get(key);
}
function randomMix(seed){
  const random=rng(seed);
  const shuffle=items=>{
    for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
    return items;
  };
  const chosen=shuffle(AQUARIUM_MODELS.filter(model=>model.kind!=='bottom')).slice(0,20);
  const bottom=shuffle(AQUARIUM_MODELS.filter(model=>model.kind==='bottom')).slice(0,4);
  for(const index of [5,10,14,22])chosen.splice(index,0,bottom.shift());
  assert.equal(chosen.length,24);
  assert.equal(chosen.filter(model=>model.kind==='bottom').length,4);
  return chosen;
}
const area=box=>Math.max(0,box.right-box.left)*Math.max(0,box.bottom-box.top);
const intersection=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const center=box=>[(box.left+box.right)/2,(box.top+box.bottom)/2];
function footprints(objects,width,height){return objects.map(object=>projectFootprint(object,silhouette(object),width,height));}
function overlapMetrics(creatures,reef){
  let animal=0,habitat=0;
  for(let i=0;i<creatures.length;i++){
    for(let j=i+1;j<creatures.length;j++)animal+=intersection(creatures[i],creatures[j]);
    for(const plant of reef)habitat+=intersection(creatures[i],plant);
  }
  const coverage=creatures.reduce((sum,box)=>sum+area(box),0);
  return {animal,habitat,total:animal+habitat,coverage,normalized:(animal+habitat)/coverage};
}
function scene(seed,width,height,chosen=INITIAL){
  // Match the controller's model qualities, mobile scale, visible subset, and
  // habitat helper. The baseline is the same scene before composition changes it.
  const world=new FlowWorld(seed,24,chosen),mobile=width<600,count=mobile?15:24;
  const objects=world.agents.slice(0,count).map((motion,i)=>({
    model:chosen[i],geometry:geometry(chosen[i],i===0?1.05:motion.radius>.11?.8:.65),
    motion,phase:motion.phase,size:motion.radius*(mobile?1.04:1),x:.5,y:.5,delay:i*.014
  }));
  const habitat=createHabitat(HABITAT_MODELS,seed,width,height,geometry);
  const reef=footprints(habitat,width,height),baselineBoxes=footprints(objects,width,height);
  const baselinePositions=objects.map(object=>[...object.motion.p]);
  const hiddenBefore=structuredClone(world.agents.slice(count));
  const placed=composeAquarium(world,objects,habitat,width,height);
  const boxes=footprints(objects,width,height);
  return {seed,width,height,world,objects,habitat,reef,boxes,placed,hiddenBefore,baselinePositions,
    baseline:overlapMetrics(baselineBoxes,reef),composed:overlapMetrics(boxes,reef)};
}
const CASES=VIEWPORTS.flatMap(([width,height])=>[
  ...[1,42,759].map(seed=>({label:`${width}x${height}, initial, seed ${seed}`,seed,width,height,chosen:INITIAL})),
  ...[2027,91403].map(seed=>({label:`${width}x${height}, mixed, seed ${seed}`,seed,width,height,chosen:randomMix(seed)}))
]);
const scenes=new Map();
function getScene(spec){if(!scenes.has(spec.label))scenes.set(spec.label,scene(spec.seed,spec.width,spec.height,spec.chosen));return scenes.get(spec.label);}
function signature(result){
  return {agents:result.world.agents,boxes:result.boxes,ids:result.objects.map(object=>object.model.id),
    sizes:result.objects.map(object=>object.size),reef:result.reef};
}

test('opening composition repeats exactly for a seed and changes across seeds',()=>{
  for(const [width,height]of VIEWPORTS){
    const a=scene(42,width,height),b=scene(42,width,height),c=scene(43,width,height);
    assert.deepEqual(signature(a),signature(b),`${width}x${height}: seeded opening is reproducible`);
    assert.notDeepEqual(a.world.agents.slice(0,a.objects.length).map(agent=>agent.p),c.world.agents.slice(0,c.objects.length).map(agent=>agent.p),`${width}x${height}: different seeds change the opening arrangement`);
  }
});

test('all visible creatures receive finite opening placements without major clipping',async t=>{
  for(const spec of CASES)await t.test(spec.label,()=>{
    const result=getScene(spec),{world,objects,boxes,placed,width,height,habitat}=result;
    assert.equal(objects.length,width<600?15:24);
    assert.equal(habitat.length,width<600?6:8);
    const unchanged=objects.filter((object,index)=>object.motion.p[0]===result.baselinePositions[index][0]&&object.motion.p[1]===result.baselinePositions[index][1]).map(object=>object.model.id);
    assert.equal(placed.length,objects.length,`${spec.label}: only ${placed.length}/${objects.length} visible creatures found a placement; unchanged random positions: ${unchanged.join(', ')}`);
    const viewport={left:0,top:0,right:width,bottom:height};
    for(let i=0;i<objects.length;i++){
      const object=objects[i],agent=object.motion,box=boxes[i],label=`${spec.label}, ${object.model.id}`;
      assert.ok([...agent.p,...agent.v,...agent.target,agent.radius,agent.heading,object.size,...Object.values(box)].every(Number.isFinite),`${label}: finite state and footprint`);
      assert.ok(area(box)>0,`${label}: nonempty projected silhouette`);
      assert.ok(agent.radius>=object.model.minSize-1e-9&&agent.radius<=object.model.maxSize+1e-9,`${label}: catalog size limits`);
      const visible=intersection(box,viewport)/area(box);
      assert.ok(visible>=.95,`${label}: ${(100*(1-visible)).toFixed(1)}% of padded silhouette lies outside the canvas`);
      assert.ok(Math.abs(agent.p[0])<1.5&&Math.abs(agent.p[1])<1.2&&Math.abs(agent.p[2])<1.1,`${label}: bounded initial position`);
    }
    assert.ok(world.agents.slice(objects.length).every(agent=>agent.p.every(Number.isFinite)));
    assert.deepEqual(world.agents.slice(objects.length),result.hiddenBefore,`${spec.label}: hidden phone agents are untouched by composition`);
    for(const box of result.reef)assert.ok(Object.values(box).every(Number.isFinite)&&area(box)>0,`${spec.label}: valid rooted habitat projection`);
  });
});

test('composition reduces projected creature and reef overlap compared with the old random placement',t=>{
  let baselineTotal=0,composedTotal=0,baselineReef=0,composedReef=0;
  const regressions=[];
  for(const [width,height]of VIEWPORTS){
    const group=CASES.filter(spec=>spec.width===width&&spec.height===height).map(getScene);
    const before=group.reduce((sum,result)=>sum+result.baseline.normalized,0);
    const after=group.reduce((sum,result)=>sum+result.composed.normalized,0);
    t.diagnostic(`${width}x${height}: normalized box overlap ${before.toFixed(3)} -> ${after.toFixed(3)} (${(100*(1-after/before)).toFixed(1)}% reduction).`);
    // Padded boxes deliberately overestimate lace, tentacles, and reef fronds.
    // Require useful improvement over the baseline, never perfect zero overlap.
    if(after>before*.85)regressions.push(`${width}x${height}: only ${(100*(1-after/before)).toFixed(1)}% reduction`);
    baselineTotal+=before;composedTotal+=after;
    baselineReef+=group.reduce((sum,result)=>sum+result.baseline.habitat/result.baseline.coverage,0);
    composedReef+=group.reduce((sum,result)=>sum+result.composed.habitat/result.composed.coverage,0);
  }
  assert.deepEqual(regressions,[],'Every tested viewport should reduce aggregate overlap by at least 15%.');
  t.diagnostic(`Reef-only normalized overlap ${baselineReef.toFixed(3)} -> ${composedReef.toFixed(3)}; all-overlap reduction ${(100*(1-composedTotal/baselineTotal)).toFixed(1)}%.`);
  assert.ok(composedTotal<baselineTotal*.75,`Overall overlap should fall at least 25%: ${baselineTotal} -> ${composedTotal}`);
  assert.ok(composedReef<baselineReef,`Reef overlap should improve as well: ${baselineReef} -> ${composedReef}`);
});

test('the focal animal and companion have distinct visual space',async t=>{
  for(const spec of CASES)await t.test(spec.label,()=>{
    const result=getScene(spec),{objects,boxes,width,height}=result;
    const first=objects.find(object=>object.motion.kind==='glide')||objects.find(object=>object.motion.kind!=='bottom');
    const second=objects.find(object=>object!==first&&/jellyfish|nettle/.test(object.model.id))||objects.find(object=>object!==first&&object.motion.kind!=='bottom');
    assert.ok(first&&second,`${spec.label}: two focal subjects exist`);
    const a=boxes[objects.indexOf(first)],b=boxes[objects.indexOf(second)],pa=center(a),pb=center(b);
    assert.ok(intersection(a,b)/Math.min(area(a),area(b))<=.02,`${spec.label}: focal silhouettes overlap`);
    assert.ok(Math.hypot(pa[0]-pb[0],pa[1]-pb[1])>=Math.min(width,height)*.23,`${spec.label}: focal subjects are crowded together`);
  });
});

function averageSpeed(agents){return agents.reduce((sum,agent)=>sum+Math.hypot(...agent.v),0)/agents.length;}
function simulate(result,seconds,onStep=()=>{}){
  for(let i=0;i<seconds*60;i++){result.world.step(1/60);onStep(result.world,i);}
}
test('the opening moves gently, keeps its initial destination, then reaches active swimming',t=>{
  for(const [width,height]of [[390,640],[1440,780],[844,260]]){
    const gentle=scene(42,width,height),full=scene(42,width,height);
    // A control with no startup ramp makes the comparison independent of the
    // precise easing equation: evaluate actual travel and measured velocities.
    full.world.openingDuration=0;
    const visible=gentle.objects.length,start=gentle.world.agents.slice(0,visible).map(agent=>[...agent.p]);
    let early=0,control=0,late=0,earlySamples=0,lateSamples=0;
    for(let frame=0;frame<15*60;frame++){
      gentle.world.step(1/60);full.world.step(1/60);
      if(frame<120){early+=averageSpeed(gentle.world.agents.slice(0,visible));control+=averageSpeed(full.world.agents.slice(0,visible));earlySamples++;}
      if(frame>=8*60){late+=averageSpeed(gentle.world.agents.slice(0,visible));lateSamples++;}
      if(frame===119){
        const travel=gentle.world.agents.slice(0,visible).reduce((sum,agent,index)=>sum+Math.hypot(...agent.p.map((n,k)=>n-start[index][k])),0)/visible;
        assert.ok(travel<.12,`${width}x${height}: excessive initial travel ${travel.toFixed(4)} in two seconds`);
      }
    }
    early/=earlySamples;control/=earlySamples;late/=lateSamples;
    t.diagnostic(`${width}x${height}: mean speed first 2s ${early.toFixed(4)}, un-ramped control ${control.toFixed(4)}, seconds 8–15 ${late.toFixed(4)}.`);
    assert.ok(early<control*.55,`${width}x${height}: opening is not meaningfully gentler than full-speed motion`);
    assert.ok(late>early*1.8&&late>.035,`${width}x${height}: opening never transitions to active swimming`);
    const arrived=scene(759,width,height),agent=arrived.world.agents[0];
    agent.target=[...agent.p];const target=[...agent.target],turns=agent.turns;
    simulate(arrived,6.5);
    assert.equal(agent.turns,turns,`${width}x${height}: an early arrival must not trigger a new opening destination`);
    assert.deepEqual(agent.target,target);
  }
});

test('composed scenes remain bounded and hidden phone agents do not move or influence visible motion',t=>{
  for(const [width,height]of [[320,370],[390,640],[1280,560],[1440,780],[844,260]]){
    const a=scene(759,width,height),b=scene(759,width,height),visible=a.objects.length,hidden=structuredClone(a.world.agents.slice(visible));
    // Put hidden fish directly on the focal animal with extreme velocities. If
    // they still participate in separation/alignment, the visible paths diverge.
    for(const hiddenAgent of b.world.agents.slice(visible)){hiddenAgent.p=[...b.world.agents[0].p];hiddenAgent.v=[2,-2,2];}
    let maxSpeed=0;
    for(let frame=0;frame<60*60;frame++){
      a.world.step(1/60);b.world.step(1/60);
      for(let i=0;i<visible;i++){
        const agent=a.world.agents[i],label=`${width}x${height}, ${a.objects[i].model.id}, t=${a.world.time.toFixed(2)}`;
        assert.ok([...agent.p,...agent.v,...agent.target,agent.heading].every(Number.isFinite),`${label}: nonfinite motion`);
        const speed=Math.hypot(...agent.v);maxSpeed=Math.max(maxSpeed,speed);
        assert.ok(speed<.7,`${label}: velocity spike ${speed}`);
        assert.ok(Math.max(...agent.p.map(Math.abs))<1.5,`${label}: escaped simulation volume`);
        // Tall animals need a slightly higher centre on a short canvas while
        // their feet still meet the same visible seabed.
        if(agent.kind==='bottom')assert.ok(Math.abs(agent.p[1]-agent.floorY)<.09,`${label}: left its viewport-adjusted reef band (${agent.p[1]})`);
      }
    }
    assert.deepEqual(a.world.agents.slice(visible),hidden,`${width}x${height}: hidden state changed during simulation`);
    assert.deepEqual(a.world.agents.slice(0,visible),b.world.agents.slice(0,visible),`${width}x${height}: hidden agents affected visible motion`);
    t.diagnostic(`${width}x${height}: one-minute composed simulation, max speed ${maxSpeed.toFixed(3)}, hidden agents unchanged.`);
  }
});
