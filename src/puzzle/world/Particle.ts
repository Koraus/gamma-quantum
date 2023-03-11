import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { ReadonlyDeep } from "../../utils/ReadonlyDeep";
import { ParticleKind } from "../terms/ParticleKind";


export type Particle = ParticleKind & {
    velocity: v2;
};

export const particleCount = (p: ReadonlyDeep<ParticleKind>) => {
    if (p.content === "gamma") { return 1; }
    return p.content.red + p.content.green + p.content.blue;
};

export const particleMass = (p: ReadonlyDeep<ParticleKind>) => {
    if (p.content === "gamma") { return 0; }
    const count = particleCount(p);
    if (count === 1) { return 1; }
    if (count === 2) { return 1; }
    if (count === 3) { return 2; }
    if (count === 4) { return 4; }
    return 999999;
};

export const particleMomentum = (p: ReadonlyDeep<Particle>) =>
    v2.scale(p.velocity, (particleMass(p) || 1) * hax.len(p.velocity));

export const particlesMomentum = (ps: Iterable<ReadonlyDeep<Particle>>) =>
    ps[Symbol.iterator]()
        .map(particleMomentum)
        .reduce(...v2.sumReducer());

export const particleEnergy = (p: ReadonlyDeep<Particle>) =>
    particleMass(p) + hax.len(particleMomentum(p));

export const particlesEnergy = (ps: Iterable<ReadonlyDeep<Particle>>) =>
    ps[Symbol.iterator]()
        .map(particleEnergy)
        .reduce((acc, v) => acc + v, 0);