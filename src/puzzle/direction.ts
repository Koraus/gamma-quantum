import { v2 } from "../utils/v";
import * as hax from "../utils/hax";

export const directionVector = hax.direction.flat60.itCwFromSouth;

export type DirectionId = 0 | 1 | 2 | 3 | 4 | 5;
export type HalfDirectionId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;


// put 30-direction into hax.ts
export const halfDirection2Vector = [
    v2.add(directionVector[0], directionVector[0]),
    v2.add(directionVector[0], directionVector[1]),
    v2.add(directionVector[1], directionVector[1]),
    v2.add(directionVector[1], directionVector[2]),
    v2.add(directionVector[2], directionVector[2]),
    v2.add(directionVector[2], directionVector[3]),
    v2.add(directionVector[3], directionVector[3]),
    v2.add(directionVector[3], directionVector[4]),
    v2.add(directionVector[4], directionVector[4]),
    v2.add(directionVector[4], directionVector[5]),
    v2.add(directionVector[5], directionVector[5]),
    v2.add(directionVector[5], directionVector[0]),
] as const;
