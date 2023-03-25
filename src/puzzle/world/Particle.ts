import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { ParticleKind, keyifyParticleContent } from "../terms/ParticleKind";
import type { ReadonlyDeep } from "ts-toolbelt/out/Object/Readonly";
import { Stringify } from "../../utils/Stringify";


export type Particle = ParticleKind & {
    velocity: v2;
};

export const _particleCount = (p_content: ParticleKind["content"]) =>
    p_content === "gamma"
        ? 1
        : p_content.red + p_content.green + p_content.blue;

export const particleCount = (p: ReadonlyDeep<ParticleKind>) =>
    _particleCount(p.content);

export const _particleMass = (p_content: ParticleKind["content"]) => {
    if (p_content === "gamma") { return 0; }
    switch (_particleCount(p_content)) {
        case 1: return 1;
        case 2: return 1;
        case 3: return 2;
        case 4: return 5;
    }
    return 999999;
};

export const particleMass = (p: ReadonlyDeep<ParticleKind>) =>
    _particleMass(p.content);

export const _addParticleMomentum = (
    p_content: Particle["content"],
    p_velocity: ReadonlyDeep<Particle["velocity"]>,
    out: [number, number],
) => {
    const m = _particleMass(p_content);
    out[0] += (m || 1) * p_velocity[0];
    out[1] += (m || 1) * p_velocity[1];
};

export const particleMomentum = (p: ReadonlyDeep<Particle>) => {
    const out = [0, 0] as [number, number];
    _addParticleMomentum(p.content, p.velocity, out);
    return out;
};

export const particlesMomentum = (ps: Iterable<ReadonlyDeep<Particle>>) => {
    const acc = [0, 0] as [number, number];
    for (const p of ps) {
        _addParticleMomentum(p.content, p.velocity, acc);
    }
    return acc;
};

export const _particleEnergy = (
    p_content: Particle["content"],
    p_velocity: ReadonlyDeep<Particle["velocity"]>,
) => {
    const m = _particleMass(p_content);
    return m + (m || 1) * hax.len(p_velocity);
};

export const particleEnergy = (p: ReadonlyDeep<Particle>) =>
    _particleEnergy(p.content, p.velocity);

export const particlesEnergy = (ps: Iterable<ReadonlyDeep<Particle>>) => {
    let acc = 0;
    for (const p of ps) {
        acc += _particleEnergy(p.content, p.velocity);
    }
    return acc;
};


export const particleDirectedMass = (p: ReadonlyDeep<Particle>) =>
    v2.scale(p.velocity, particleMass(p));

export const particlesDirectedMass = (ps: Iterable<ReadonlyDeep<Particle>>) =>
    ps[Symbol.iterator]()
        .map(particleDirectedMass)
        .reduce(...v2.sumReducer());

export const keyifyParticle = (p: Particle) => (
    "{\"content\":"
    + keyifyParticleContent(p.content)
    + ",\"velocity\":["
    + p.velocity[0]
    + ","
    + p.velocity[1]
    + "]}"
) as Stringify<Particle>;