import { OCEAN_MODELS } from './ocean.mjs';
import { SKY_MODELS } from './sky.mjs';
import { LAND_MODELS } from './land.mjs';
import { SPACE_MODELS } from './space.mjs';

export const MODELS=Object.freeze([...OCEAN_MODELS,...SKY_MODELS,...LAND_MODELS,...SPACE_MODELS]);
export const MODEL_BY_ID=new Map(MODELS.map(model=>[model.id,model]));
