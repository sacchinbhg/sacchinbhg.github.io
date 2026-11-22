import {OCEAN_MODELS} from './ocean.mjs';
import {WILDLIFE_MODELS} from './wildlife.mjs';
import {REEF_FISH_MODELS} from './reef-fish.mjs';
export {HABITAT_MODELS} from './reef-habitat.mjs';

const bottom=new Set(['lobster','crab','starfish','hermit-crab','sea-urchin','scallop','blue-ringed-octopus']);
const drift=new Set(['moon-jellyfish','sea-nettle','lions-mane-jellyfish','seahorse','sea-dragon','octopus','nautilus','squid']);
const glide=new Set(['green-sea-turtle','leatherback-turtle','manta-ray','stingray']);
const uprightHead=new Set(['green-sea-turtle','leatherback-turtle','manta-ray','stingray']);
const small=new Set(['neon-tetra','zebrafish','guppy','shrimp']);
export const AQUARIUM_MODELS=Object.freeze([
  ...OCEAN_MODELS.filter(m=>!['humpback-whale','bottlenose-dolphin','great-white-shark'].includes(m.id)),
  ...WILDLIFE_MODELS,...REEF_FISH_MODELS
].map(model=>({
  ...model,
  kind:bottom.has(model.id)?'bottom':drift.has(model.id)?'drift':glide.has(model.id)?'glide':'swim',
  minSize:small.has(model.id)?.06:glide.has(model.id)?.125:Math.min(model.minSize||.08,.105),
  maxSize:small.has(model.id)?.075:glide.has(model.id)?.15:.12,
  orientation:uprightHead.has(model.id)?[model.orientation[0],model.orientation[1],model.orientation[2]+Math.PI/2]:model.orientation
})));
export const AQUARIUM_BY_ID=new Map(AQUARIUM_MODELS.map(m=>[m.id,m]));
export const INITIAL_SUBJECTS=['clownfish','green-sea-turtle','moon-jellyfish','angelfish','manta-ray','crab','tang','betta','seahorse','pufferfish','starfish','moorish-idol','lionfish','neon-tetra','hermit-crab','hammerhead-shark','discus','guppy','koi','shrimp','squid','lionhead-goldfish','lobster','longhorn-cowfish'];
