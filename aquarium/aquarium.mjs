import * as THREE from '../vendor/three/three.module.js';
import {AsciiPass} from './ascii-pass.mjs';
import {makeFish,makeTurtle,makeRay,makeJelly,makeHabitat,disposeTree} from './creatures.mjs';
import {rng} from '../models/geometry.mjs';
import {FlowWorld} from '../models/flow.mjs';

const $=id=>document.getElementById(id),stage=$('aquarium'),canvas=$('study-canvas');
try { start(); } catch(error) { console.error(error);$('loading').hidden=true;$('fallback').hidden=false;document.querySelector('.study-controls').hidden=true;$('study-hint').textContent='Reload to try the artwork again.';stage.dataset.state='fallback'; }

function start(){
  const preference=matchMedia('(prefers-reduced-motion: reduce)'),params=new URLSearchParams(location.search);
  let paused=preference.matches||params.get('paused')==='1',time=0,age=0,last=0,raf=0,lastPaint=0,accumulator=0;
  let yaw=0,pitch=0,targetYaw=0,targetPitch=0,pointer=null,world,animals=[],habitat,sceneRoot;
  let width=1,height=1,horizontal=8.6,seed=Number(params.get('seed')||82)>>>0,generation=0,narrowLayout=null;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const pass=new AsciiPass(renderer),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,65);
  scene.background=new THREE.Color('#07151e');scene.fog=new THREE.FogExp2('#071b27',.038);
  const hemisphere=new THREE.HemisphereLight('#a7e9ed','#34324d',1.5);scene.add(hemisphere);
  const sun=new THREE.DirectionalLight('#d3faf0',2.7);sun.position.set(-5,8,7);scene.add(sun);
  const rim=new THREE.DirectionalLight('#7fa8eb',1.8);rim.position.set(5,2,-5);scene.add(rim);
  const coralLight=new THREE.PointLight('#ec9875',18,14,2);coralLight.position.set(-4,-2,3);scene.add(coralLight);

  // A sculpted sand bed and moving caustic light place the creatures in one volume.
  const floorGeo=new THREE.PlaneGeometry(38,22,64,36);floorGeo.rotateX(-Math.PI/2);
  const floorPositions=floorGeo.attributes.position;
  for(let i=0;i<floorPositions.count;i++){
    const x=floorPositions.getX(i),z=floorPositions.getZ(i);
    floorPositions.setY(i,-4.40+.15*Math.sin(x*.63+z*.6)+.055*Math.sin(x*2.3-z*.7));
  }
  floorGeo.computeVertexNormals();
  const floorMat=new THREE.ShaderMaterial({uniforms:{time:{value:0}},side:THREE.DoubleSide,
    vertexShader:'varying vec3 p; void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec3 p; uniform float time;
    void main(){
      vec2 q=p.xz;float a=sin(q.x*2.8+sin(q.y*2.4+time*.32))+sin(q.y*3.4-sin(q.x*1.9-time*.27));
      float b=sin(q.x*3.6+q.y*1.2-time*.22)+cos(q.y*2.2-q.x*.8+time*.31);
      float caustic=pow(max(0.,1.-abs(a)*.62),12.)*.65+pow(max(0.,1.-abs(b)*.7),16.)*.35;
      float grain=fract(sin(dot(q,vec2(219.3,371.1)))*43758.5453);
      vec3 c=vec3(.012,.032,.035)+vec3(.04,.07,.06)*caustic;
      c+=grain*.004;
      gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`});
  const floor=new THREE.Mesh(floorGeo,floorMat);scene.add(floor);

  const bubbleGeo=new THREE.BufferGeometry(),bubbleData=new Float32Array(110*3),bubbleRandom=rng(71);
  for(let i=0;i<bubbleData.length;i+=3){bubbleData[i]=(bubbleRandom()-.5)*19;bubbleData[i+1]=(bubbleRandom()-.5)*12;bubbleData[i+2]=(bubbleRandom()-.5)*9;}
  bubbleGeo.setAttribute('position',new THREE.BufferAttribute(bubbleData,3));
  const bubbleMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0},pixelRatio:{value:renderer.getPixelRatio()}},
    vertexShader:`uniform float time,pixelRatio; varying float fade;
      void main(){vec3 p=position;p.y=mod(p.y+6.+time*(.16+.02*mod(position.x,3.)),12.)-6.;p.x+=sin(time*.4+p.y)*.08;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(60./-mv.z,1.4,4.)*pixelRatio;fade=.18+.2*sin(position.x*2.);}`,
    fragmentShader:'varying float fade;void main(){float d=length(gl_PointCoord-.5);float ring=smoothstep(.5,.36,d)*smoothstep(.22,.36,d);gl_FragColor=vec4(.45,.75,.8,ring*fade);}'});
  scene.add(new THREE.Points(bubbleGeo,bubbleMat));

  // Quiet light shafts, behind the animals; all of this also passes through ASCII.
  const shafts=new THREE.Group();scene.add(shafts);
  for(let i=0;i<4;i++){
    const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
      uniforms:{time:{value:0},phase:{value:i}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'varying vec2 vUv;uniform float time,phase;void main(){float edge=pow(sin(vUv.x*3.14159),3.);float strength=edge*vUv.y*.018*(.8+.2*sin(time*.3+phase));gl_FragColor=vec4(.22,.58,.69,strength);}'});
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.1,17),mat);mesh.position.set(-7+i*4.3,1,-4.5);mesh.rotation.z=-.20;shafts.add(mesh);
  }

  function build(){
    if(sceneRoot){scene.remove(sceneRoot);disposeTree(sceneRoot);}
    sceneRoot=new THREE.Group();scene.add(sceneRoot);const random=rng(seed);
    habitat=makeHabitat(random);sceneRoot.add(habitat.root);
    const colors=['#ee8358','#43c5b7','#d7b34b','#9583d5','#d56a9d','#84b45f'];
    const specs=[
      ['turtle',-.52,.22,.28,1.44],['jelly',.53,.40,.02,1.36],['ray',.15,-.28,-.56,1.35],
      ['clownfish',-.60,-.17,.25,.82],['angelfish',.56,-.08,-.12,.72],['reef',-.06,.43,-.17,.74],
      ['jelly',-.67,.46,-.55,.78],['reef',.10,-.38,.15,.76],['clownfish',.69,.29,-.5,.61],
      ['angelfish',-.54,-.43,-.19,.60],['neon',.28,.12,-.45,.48],['neon',.40,.07,-.40,.43],
      ['neon',.25,.23,-.57,.43],['neon',.53,.17,-.63,.42],['jelly',.73,-.32,.02,.78],
      ['reef',-.23,-.26,-.55,.62],['clownfish',.35,-.57,.32,.56],['reef',-.75,.06,-.40,.52]
    ];
    animals=specs.map(([kind,x,y,z,size],i)=>{
      const animal=kind==='turtle'?makeTurtle():kind==='ray'?makeRay():kind==='jelly'?makeJelly(i===1?'#e4a1cf':'#83c7dd'):makeFish(kind,colors[(i+generation)%colors.length]);
      animal.size=size;animal.start=[x+(random()-.5)*.07,y+(random()-.5)*.06,z];animal.phase=random()*Math.PI*2;animal.heading=x<0?0:Math.PI;
      animal.root.scale.setScalar(size);sceneRoot.add(animal.root);return animal;
    });
    world=new FlowWorld(seed,animals.length,animals.map(a=>({id:a.kind,kind:a.kind,minSize:.10,maxSize:.13})));
    world.openingDuration=7;
    world.agents.forEach((agent,i)=>{
      const a=animals[i];agent.p=[a.start[0],-a.start[1]*1.45,a.start[2]];agent.v=[0,0,0];agent.heading=a.heading;
      agent.target=[agent.p[0]+(Math.cos(a.heading)>0?.35:-.35),agent.p[1]+(random()-.5)*.12,agent.p[2]+(random()-.5)*.3];agent.nextTurn=7+random()*6;
    });
    age=0;generation++;narrowLayout=null;resize();
    canvas.dataset.generation=String(generation);canvas.dataset.seed=String(seed);
    $('study-status').textContent='An ASCII aquarium with swimming fish, a sea turtle, a manta ray, drifting jellyfish, and a planted reef.';
  }

  function resize(){
    const rect=stage.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    renderer.setSize(width,height,false);pass.resize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
    const profile=$('study-profile').getBoundingClientRect();
    pass.uniforms.quietArea.value.set((profile.x+profile.width/2-rect.x)/width,1-(profile.y+profile.height/2-rect.y)/height,(profile.width/2+36)/width,(profile.height/2+18)/height);
    horizontal=Math.min(12.1,5.2*camera.aspect);const mobile=width<600;
    if(world)world.visibleCount=mobile?12:animals.length;
    for(let i=0;i<animals.length;i++){animals[i].root.visible=!mobile||i<12;animals[i].root.scale.setScalar(animals[i].size*(mobile?(i<3?.60:.63):1));}
    if(world&&narrowLayout!==mobile){
      // Portrait composition gets its own vertical rhythm instead of squeezing
      // the desktop school into the same band of water.
      const portrait=[[-.30,.43],[.45,.60],[.08,-.24],[.48,.02],[-.45,-.26],[-.48,.67],[-.60,.22],[.34,-.49],[-.48,-.48],[.47,-.24],[-.34,-.06],[.44,.26]];
      world.agents.forEach((agent,i)=>{const point=mobile&&portrait[i]?portrait[i]:animals[i].start;agent.p[0]=point[0];agent.p[1]=-point[1]*1.45;agent.v=[0,0,0];agent.target=[agent.p[0]+(Math.cos(agent.heading)>0?.30:-.30),agent.p[1],agent.p[2]];});
      narrowLayout=mobile;
    }
    if(habitat)habitat.root.scale.x=horizontal/8.6;
    floor.scale.x=Math.min(1,horizontal/8.6);shafts.scale.x=horizontal/8.6;
    draw();schedule();
  }
  function draw(){
    camera.position.set(Math.sin(yaw)*16.5,1.35+pitch*6,Math.cos(yaw)*16.5);camera.lookAt(0,-.2,0);
    for(let i=0;i<animals.length;i++){
      const a=animals[i],agent=world.agents[i];if(!a.root.visible)continue;
      a.root.position.set(agent.p[0]*horizontal,-agent.p[1]*4.7,agent.p[2]*3.8);
      a.root.rotation.y=a.kind==='drift'?Math.sin(time*.12+a.phase)*.15:agent.heading;
      a.root.rotation.z=a.kind==='drift'?Math.sin(time*.27+a.phase)*.055:Math.atan2(-agent.v[1],Math.abs(agent.v[0])+.1)*.15;
      a.update(time+a.phase);
    }
    habitat.update(time);floorMat.uniforms.time.value=time;bubbleMat.uniforms.time.value=time;
    for(const shaft of shafts.children)shaft.material.uniforms.time.value=time;
    pass.uniforms.reveal.value=paused||preference.matches?1:Math.min(1,age/1.8);
    const begin=performance.now();
    pass.render(scene,camera);
    canvas.dataset.state='ready';canvas.dataset.mode='ascii';canvas.dataset.time=time.toFixed(2);canvas.dataset.paused=String(paused);
    canvas.dataset.view=`${yaw.toFixed(2)},${pitch.toFixed(2)}`;canvas.dataset.renderMs=(performance.now()-begin).toFixed(1);
    canvas.dataset.geometries=String(renderer.info.memory.geometries);canvas.dataset.textures=String(renderer.info.memory.textures);
  }
  function frame(now){
    raf=0;if(document.hidden){last=0;return;}
    const delta=last?Math.min((now-last)/1000,.07):0;last=now;
    if(!paused){time+=delta;age+=delta;accumulator+=delta;while(accumulator>=1/60){world.step(1/60);accumulator-=1/60;}}
    const blend=preference.matches?1:1-Math.exp(-delta*12);yaw+=(targetYaw-yaw)*blend;pitch+=(targetPitch-pitch)*blend;
    if(now-lastPaint>=1000/30){draw();lastPaint=now;}
    if(!paused||Math.abs(yaw-targetYaw)+Math.abs(pitch-targetPitch)>.0005)schedule();else{draw();last=0;}
  }
  function schedule(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
  function setPaused(value){paused=value;$('motion').textContent=paused?'Resume':'Pause';$('study-status').textContent=paused?'The aquarium is paused.':'The aquarium is moving.';last=0;draw();schedule();}
  $('motion').addEventListener('click',()=>setPaused(!paused));
  $('new-scene').addEventListener('click',()=>{seed=(seed+Math.floor(Math.random()*100000)+1)>>>0;build();draw();schedule();});
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:targetYaw,pitch:targetPitch};stage.setPointerCapture(e.pointerId);stage.focus({preventScroll:true});});
  stage.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;targetYaw=THREE.MathUtils.clamp(pointer.yaw+(pointer.x-e.clientX)*.003,-.62,.62);targetPitch=THREE.MathUtils.clamp(pointer.pitch+(e.clientY-pointer.y)*.002,-.24,.40);schedule();});
  const release=()=>{pointer=null;};stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
  stage.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home',' '].includes(e.key))return;e.preventDefault();
    if(e.key===' ')return setPaused(!paused);
    if(e.key==='Home')targetYaw=targetPitch=0;
    if(e.key==='ArrowLeft')targetYaw=Math.max(-.62,targetYaw-.12);
    if(e.key==='ArrowRight')targetYaw=Math.min(.62,targetYaw+.12);
    if(e.key==='ArrowUp')targetPitch=Math.min(.40,targetPitch+.10);
    if(e.key==='ArrowDown')targetPitch=Math.max(-.24,targetPitch-.10);
    yaw=targetYaw;pitch=targetPitch;draw();schedule();
  });
  preference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else schedule();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;$('fallback').hidden=false;stage.dataset.state='fallback';});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);resizeObserver.observe($('study-profile'));
  build();$('loading').hidden=true;$('motion').textContent=paused?'Resume':'Pause';stage.dataset.state='ready';schedule();
}
