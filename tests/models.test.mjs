import assert from 'node:assert/strict';
import { MODELS } from '../models/catalog.mjs';
import { STRIDE } from '../models/geometry.mjs';

assert.equal(MODELS.length,40,'The first collection contains forty subjects.');
assert.equal(new Set(MODELS.map(m=>m.id)).size,MODELS.length,'Subject IDs must be unique.');
for(const model of MODELS){
  assert.ok(model.name&&model.category);
  for(const quality of [.7,1.1,1.8]){
    const {points,joints}=model.build(41,quality);
    assert.ok(points.length>1000&&points.length%STRIDE===0,model.id+' has complete vertices');
    assert.ok(points.length/STRIDE<60000,model.id+' stays within the per-model budget');
    for(let i=0;i<points.length;i+=STRIDE){
      for(let j=0;j<STRIDE;j++)assert.ok(Number.isFinite(points[i+j]),model.id+' has finite geometry');
      assert.ok(Math.hypot(points[i],points[i+1],points[i+2])<1.00001,model.id+' is normalized');
      assert.ok(Number.isInteger(points[i+6])&&points[i+6]>=0&&points[i+6]<12,model.id+' has a valid material');
      assert.ok(Number.isInteger(points[i+8])&&points[i+8]>=0&&points[i+8]<=joints.length,model.id+' has a valid joint');
    }
    joints.forEach((joint,i)=>{assert.ok(joint.parent>=0&&joint.parent<=i,model.id+' joint hierarchy is acyclic');assert.ok([...joint.pivot,...joint.axis,joint.amplitude,joint.speed,joint.phase].every(Number.isFinite));});
  }
  assert.deepEqual(model.build(41,.7),model.build(41,.7),model.id+' is deterministic');
}
console.log('PASS: 40 original models; 120 quality variants; finite geometry, bounds, materials, joint hierarchies, point budgets, and deterministic generation.');
