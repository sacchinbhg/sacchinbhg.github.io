import assert from 'node:assert/strict';
import test from 'node:test';
import {AQUARIUM_MODELS, AQUARIUM_BY_ID, HABITAT_MODELS} from '../models/aquarium-catalog.mjs';
import {FlowWorld} from '../models/flow.mjs';
import {MAT, STRIDE} from '../models/geometry.mjs';

const ALL_MODELS=[...AQUARIUM_MODELS,...HABITAT_MODELS];
const MATERIALS=new Set(Object.values(MAT));
const PROFILES=new Set(['bottom','drift','glide','swim']);
const GEOMETRY_SEED=41;
const DT=1/60;
const DURATION=180;

test('aquarium catalog exposes 44 creatures and eight distinct, usable habitat models',()=>{
  assert.equal(AQUARIUM_MODELS.length,44);
  assert.equal(HABITAT_MODELS.length,8);
  assert.equal(new Set(ALL_MODELS.map(model=>model.id)).size,52,'IDs must be unique across creatures and habitat.');
  assert.equal(AQUARIUM_BY_ID.size,44);
  for(const model of ALL_MODELS){
    assert.match(model.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/,model.id);
    assert.ok(typeof model.name==='string'&&model.name.trim().length>0,`${model.id}: accessible name`);
    assert.equal(typeof model.build,'function',`${model.id}: builder`);
    assert.equal(model.orientation.length,3,`${model.id}: three rotation axes`);
    assert.ok(model.orientation.every(Number.isFinite),`${model.id}: finite orientation`);
  }
  for(const model of AQUARIUM_MODELS){
    assert.equal(AQUARIUM_BY_ID.get(model.id),model,`${model.id}: lookup resolves the catalog entry`);
    assert.ok(PROFILES.has(model.kind),`${model.id}: recognized motion profile`);
    assert.ok(model.minSize>0&&model.maxSize>=model.minSize,`${model.id}: coherent size limits`);
  }
  for(const kind of PROFILES)assert.ok(AQUARIUM_MODELS.some(model=>model.kind===kind),`${kind} has coverage`);
  for(const model of HABITAT_MODELS)assert.equal(model.category,'Habitat',model.id);
});

function validateGeometry(model,quality){
  const label=`${model.id} at quality ${quality}`;
  const geometry=model.build(GEOMETRY_SEED,quality);
  const {points,joints}=geometry;
  assert.ok(points instanceof Float32Array,`${label}: Float32Array points`);
  assert.equal(points.length%STRIDE,0,`${label}: whole vertex records`);
  assert.ok(points.length>=STRIDE*100,`${label}: meaningful geometry`);
  assert.ok(Array.isArray(joints),`${label}: joint collection`);
  let maximumRadius=0,minY=Infinity,maxY=-Infinity;
  for(let i=0;i<points.length;i+=STRIDE){
    for(let component=0;component<STRIDE;component++){
      if(!Number.isFinite(points[i+component]))assert.fail(`${label}: non-finite vertex ${i/STRIDE}, component ${component}`);
    }
    const radius=Math.hypot(points[i],points[i+1],points[i+2]);
    if(radius>1.00001)assert.fail(`${label}: vertex ${i/STRIDE} exceeds normalized radius (${radius})`);
    maximumRadius=Math.max(maximumRadius,radius);minY=Math.min(minY,points[i+1]);maxY=Math.max(maxY,points[i+1]);
    if(!MATERIALS.has(points[i+6]))assert.fail(`${label}: invalid material ${points[i+6]} at vertex ${i/STRIDE}`);
    if(points[i+7]<0)assert.fail(`${label}: negative shading at vertex ${i/STRIDE}`);
    const joint=points[i+8],flags=points[i+9];
    if(!Number.isInteger(joint)||joint<0||joint>joints.length)assert.fail(`${label}: missing joint ${joint} at vertex ${i/STRIDE}`);
    if(!Number.isInteger(flags)||flags<0||flags>3)assert.fail(`${label}: invalid renderer flags ${flags}`);
  }
  assert.ok(maximumRadius>.999,`${label}: normalization reaches unit scale`);
  for(let index=0;index<joints.length;index++){
    const joint=joints[index],name=`${label}: joint ${index+1}`;
    assert.equal(joint.pivot.length,3,`${name}: pivot`);
    assert.equal(joint.axis.length,3,`${name}: axis`);
    assert.ok([...joint.pivot,...joint.axis,joint.amplitude,joint.speed,joint.phase].every(Number.isFinite),`${name}: finite transform`);
    assert.ok(Math.abs(Math.hypot(...joint.axis)-1)<.00001,`${name}: unit rotation axis`);
    assert.ok(Number.isInteger(joint.parent)&&joint.parent>=0&&joint.parent<index+1,`${name}: parent precedes child in renderer order`);
  }
  if(model.category==='Habitat')assert.ok(minY<0&&maxY>0,`${label}: growth above a positive-y floor attachment`);
  const repeated=model.build(GEOMETRY_SEED,quality);
  assert.deepEqual(repeated.points,points,`${label}: identical seeds reproduce geometry`);
  assert.deepEqual(repeated.joints,joints,`${label}: identical seeds reproduce joint motion`);
  return points.length/STRIDE;
}

test('all 52 models produce finite, normalized, deterministic renderer inputs at both deployed detail levels',async t=>{
  let maximumVertices=0;
  for(const model of ALL_MODELS){
    await t.test(model.id,()=>{
      for(const quality of [.65,1.05])maximumVertices=Math.max(maximumVertices,validateGeometry(model,quality));
    });
  }
  t.diagnostic(`Validated 104 model/detail combinations; largest geometry: ${maximumVertices} vertices.`);
});

function runSimulation(seed){
  // Pass full catalog specifications, not bare size numbers, so bottom, drift,
  // glide, and swim behavior all run together under the same separation forces.
  const world=new FlowWorld(seed,AQUARIUM_MODELS.length,AQUARIUM_MODELS);
  const repeated=new FlowWorld(seed,AQUARIUM_MODELS.length,AQUARIUM_MODELS);
  assert.deepEqual(world.agents,repeated.agents,`seed ${seed}: deterministic initial placement and destinations`);
  assert.equal(world.agents.length,44);
  const different=new FlowWorld(seed+1,AQUARIUM_MODELS.length,AQUARIUM_MODELS);
  assert.notDeepEqual(world.agents.map(agent=>agent.p),different.agents.map(agent=>agent.p),'Different seeds must change the initial aquarium.');
  const tracks=world.agents.map((agent,index)=>{
    const spec=AQUARIUM_MODELS[index];
    assert.equal(agent.kind,spec.kind,`${spec.id}: profile reaches FlowWorld`);
    assert.ok(agent.radius>=spec.minSize-1e-9&&agent.radius<=spec.maxSize+1e-9,`${spec.id}: initial radius respects catalog`);
    return {id:spec.id,kind:agent.kind,previous:[...agent.p],target:[...agent.target],turns:agent.turns,changes:0,
      minZ:agent.p[2],maxZ:agent.p[2],minY:agent.p[1],maxY:agent.p[1],distance:0,speedSum:0,samples:0};
  });
  assert.ok(new Set(world.agents.map(agent=>agent.nextTurn)).size>world.agents.length*.9,'Destination timers must be independent.');
  let maxSpeed=0,maxPosition=0;
  for(let frame=0;frame<DURATION/DT;frame++){
    world.step(DT);
    if(frame<600)repeated.step(DT);
    if(frame===599)assert.deepEqual(world.agents,repeated.agents,`seed ${seed}: deterministic motion and destination changes after ten seconds`);
    for(let index=0;index<world.agents.length;index++){
      const agent=world.agents[index],track=tracks[index],label=`seed ${seed}, ${track.id}, t=${world.time.toFixed(2)}`;
      if(![...agent.p,...agent.v,...agent.target,agent.heading,agent.nextTurn].every(Number.isFinite))assert.fail(`${label}: non-finite motion`);
      const speed=Math.hypot(...agent.v),extent=Math.max(...agent.p.map(Math.abs));
      if(speed>=.7)assert.fail(`${label}: velocity spike ${speed}`);
      if(extent>=1.5)assert.fail(`${label}: escaped aquarium volume ${agent.p.join(',')}`);
      maxSpeed=Math.max(maxSpeed,speed);maxPosition=Math.max(maxPosition,extent);
      track.distance+=Math.hypot(...agent.p.map((value,k)=>value-track.previous[k]));track.previous=[...agent.p];
      track.minZ=Math.min(track.minZ,agent.p[2]);track.maxZ=Math.max(track.maxZ,agent.p[2]);
      track.minY=Math.min(track.minY,agent.p[1]);track.maxY=Math.max(track.maxY,agent.p[1]);
      if(agent.turns!==track.turns){
        assert.ok(agent.turns>track.turns,`${label}: turn counter increases`);
        assert.ok(Math.hypot(...agent.target.map((value,k)=>value-track.target[k]))>.001,`${label}: new destination is a real change`);
        track.changes++;track.turns=agent.turns;track.target=[...agent.target];
      }
      if(frame>=300){track.speedSum+=speed;track.samples++;}
    }
  }
  assert.ok(Math.abs(world.time-DURATION)<1e-6,'Each run covers three simulated minutes.');
  for(const track of tracks){
    assert.ok(track.changes>=10,`seed ${seed}, ${track.id}: only ${track.changes} destination changes in three minutes`);
    assert.ok(track.distance>1,`seed ${seed}, ${track.id}: stalled, traveled only ${track.distance}`);
    if(track.kind==='bottom'){
      // A two-hundredth tolerance permits soft steering around the intended
      // .78–.88 reef band without allowing bottom dwellers to become swimmers.
      assert.ok(track.minY>=.76&&track.maxY<=.90,`seed ${seed}, ${track.id}: left the reef band, y=${track.minY.toFixed(4)}..${track.maxY.toFixed(4)}`);
    }
  }
  const water=tracks.filter(track=>track.kind!=='bottom');
  assert.ok(water.filter(track=>track.maxZ-track.minZ>.20).length>=water.length*.75,`seed ${seed}: insufficient three-dimensional travel`);
  assert.ok(new Set(world.agents.map(agent=>agent.nextTurn)).size>world.agents.length*.9,`seed ${seed}: destination timers became synchronized`);
  const meanSpeed=kind=>{
    const group=tracks.filter(track=>track.kind===kind);
    return group.reduce((sum,track)=>sum+track.speedSum/track.samples,0)/group.length;
  };
  const drift=meanSpeed('drift'),swim=meanSpeed('swim');
  assert.ok(drift<swim,`seed ${seed}: drifters must remain slower than swimmers (${drift.toFixed(4)} vs ${swim.toFixed(4)})`);
  return {maxSpeed,maxPosition,drift,swim,minTurns:Math.min(...tracks.map(track=>track.changes))};
}

for(const seed of [1,42,759,123456]){
  test(`full-catalog aquarium remains healthy for three minutes (seed ${seed})`,t=>{
    const result=runSimulation(seed);
    t.diagnostic(`44 creatures; max velocity ${result.maxSpeed.toFixed(3)}; mean drift/swim ${result.drift.toFixed(3)}/${result.swim.toFixed(3)}; minimum destination changes ${result.minTurns}.`);
  });
}
