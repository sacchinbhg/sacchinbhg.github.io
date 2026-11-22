import assert from 'node:assert/strict';
import {FlowWorld} from '../models/flow.mjs';
import {SCULPTURES} from '../models/sculptures.mjs';

for(const seed of [1,42,759,123456]){
  const world=new FlowWorld(seed),same=new FlowWorld(seed);
  assert.deepEqual(world.agents,same.agents,'Seeded initial conditions must reproduce.');
  const start=world.agents.map(a=>[...a.p]);let maxExtent=0;
  for(let frame=0;frame<36000;frame++){
    world.step(1/60);
    if(frame<120)same.step(1/60);
    if(frame===119)assert.deepEqual(world.agents,same.agents,'Simulation must be deterministic.');
    for(const a of world.agents){
      assert.ok([...a.p,...a.v].every(Number.isFinite),'Motion must remain finite.');
      assert.ok(Math.hypot(...a.v)<.7,'No sudden velocity spikes.');
      if(frame>180){const p=3.8/(3.8-a.p[2]*.8-a.radius);maxExtent=Math.max(maxExtent,(Math.max(Math.abs(a.p[0]),Math.abs(a.p[1]))*.38+a.radius*1.15)*p);}
    }
  }
  assert.ok(maxExtent<.53,`Soft confinement keeps forms in view: ${maxExtent}`);
  assert.notDeepEqual(world.agents.map(a=>a.p),start,'Forms must actually travel in 3D.');
}
for(const model of SCULPTURES){const g=model.build(41,.75);assert.ok([...g.points].every(Number.isFinite),model.id);assert.ok(g.points.length>1000);}
console.log('PASS: four 10-minute simulations; reproducible randomness, bounded velocity, visible confinement, 3D travel, and valid sculpture geometry.');
