import { DirectionId } from "../puzzle/terms";
import { v2, v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { directionVector } from "../puzzle/stepInPlace";


export type Particle = {
    mass: number,
    color: string,
};

export type ParticleWithMomentum = Particle & {
    direction: DirectionId,
    velocity: 0 | 1,
}

export const particleMomentum = (p: ParticleWithMomentum) =>
    v3.scale(directionVector[p.direction], (p.mass || 1) * p.velocity);

export const particleEnegry = (p: ParticleWithMomentum) =>
    p.mass + hg.cubeLen(particleMomentum(p));

