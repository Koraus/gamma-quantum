import { v3 } from "../utils/v";
import * as hg from "../utils/hg";


export type Particle = {
    mass: number,
    color: string,
};

export type ParticleWithMomentum = Particle & {
    velocity: v3,
}

export const particleMomentum = (p: ParticleWithMomentum) =>
    v3.scale(p.velocity, (p.mass || 1) * hg.cubeLen(p.velocity));

export const particleEnegry = (p: ParticleWithMomentum) =>
    p.mass + hg.cubeLen(particleMomentum(p));

