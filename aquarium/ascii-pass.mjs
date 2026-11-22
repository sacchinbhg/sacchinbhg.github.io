import * as THREE from '../vendor/three/three.module.js';

// The scene stays on the GPU: no readPixels, per-character DOM, or canvas redraws.
// A single post-process samples its colour and chooses a glyph from this atlas.
export class AsciiPass {
  constructor(renderer) {
    this.renderer=renderer;
    const glyphs=' .,:;i!+~=x*%#@MW',tile=20,atlas=document.createElement('canvas');
    atlas.width=tile*glyphs.length;atlas.height=32;
    const ctx=atlas.getContext('2d');
    ctx.fillStyle='#fff';ctx.font='bold 27px "Courier New",monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    [...glyphs].forEach((glyph,i)=>ctx.fillText(glyph,i*tile+tile/2,17));
    this.atlas=new THREE.CanvasTexture(atlas);this.atlas.minFilter=THREE.LinearFilter;this.atlas.magFilter=THREE.LinearFilter;
    this.atlas.generateMipmaps=false;
    this.target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:true});
    this.uniforms={sceneTexture:{value:this.target.texture},glyphTexture:{value:this.atlas},
      grid:{value:new THREE.Vector2(180,70)},glyphCount:{value:glyphs.length},reveal:{value:1},quietArea:{value:new THREE.Vector4(.5,.55,.18,.10)}};
    this.material=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,uniforms:this.uniforms,
      vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader:`varying vec2 vUv;
      uniform sampler2D sceneTexture,glyphTexture;
      uniform vec2 grid;
      uniform vec4 quietArea;
      uniform float glyphCount,reveal;
      vec3 displayColour(vec3 c){c*=1.25;c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);return pow(clamp(c,0.,1.),vec3(1./2.2));}
      void main(){
        vec2 cell=floor(vUv*grid),sampleUV=(cell+.5)/grid,within=fract(vUv*grid);
        vec3 c=displayColour(texture2D(sceneTexture,sampleUV).rgb);
        float luma=dot(c,vec3(.2126,.7152,.0722));
        float index=floor(clamp(pow(luma,.92)*.98,0.,.999)*(glyphCount-1.));
        float ink=texture2D(glyphTexture,vec2((index+within.x)/glyphCount,within.y)).a;
        vec3 paper=mix(vec3(.018,.034,.043),vec3(.025,.055,.067),vUv.y);
        float visible=smoothstep(.075,.19,luma);
        vec3 colour=mix(vec3(luma),c,1.35)*(1.45+.12*luma);
        // A soft falloff keeps the centered identity readable as animals pass.
        vec2 distanceToType=abs(vUv-quietArea.xy)/quietArea.zw;
        float quiet=1.-smoothstep(.72,1.6,length(pow(distanceToType,vec2(3.))));
        float footer=smoothstep(.025,.11,vUv.y);
        vec3 result=paper+ink*colour*visible*mix(.16,1.,1.-quiet)*mix(.26,1.,footer);
        float distanceFromCenter=length((vUv-.5)*vec2(1.35,1.));
        float opening=smoothstep(distanceFromCenter-.12,distanceFromCenter+.23,reveal*1.25);
        gl_FragColor=vec4(mix(paper,result,opening),1.);
      }`});
    this.scene=new THREE.Scene();this.camera=new THREE.Camera();
    this.quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.material);this.scene.add(this.quad);
  }
  resize(width,height) {
    // Full cell coverage with a bounded intermediate texture, independent of DPR.
    const scale=Math.min(1,1600/width);
    this.target.setSize(Math.round(width*scale),Math.round(height*scale));
    const cell=width<600?3.2:4;
    this.uniforms.grid.value.set(Math.floor(width/cell),Math.floor(height/(cell*1.65)));
  }
  render(scene,camera) {
    this.renderer.setRenderTarget(this.target);this.renderer.render(scene,camera);
    this.renderer.setRenderTarget(null);this.renderer.render(this.scene,this.camera);
  }
  dispose(){this.target.dispose();this.atlas.dispose();this.material.dispose();this.quad.geometry.dispose();}
}
