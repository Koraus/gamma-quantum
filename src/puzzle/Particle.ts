import { createKeyify } from "../utils/keyify";
import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { ReadonlyDeep } from "../utils/ReadonlyDeep";

export type ParticleKind = {
    content: "gamma" | {
        red: number, // 0, 1, 2, ...
        green: number, // 0, 1, 2, ...
        blue: number, // 0, 1, 2, ...
        // todo: but not all zeros
    };
}
export const keyProjectParticleKind = ({
    content
}: ParticleKind): ParticleKind => ({
    content: content === "gamma"
        ? content
        : { red: content.red, green: content.green, blue: content.blue },
})
export const keyifyParticleKind = createKeyify(keyProjectParticleKind);
export type ParticleKindKey = ReturnType<typeof keyifyParticleKind>;
export const parsePartilceKind = (key: ParticleKindKey) => JSON.parse(key) as ParticleKind;


export type Particle = ParticleKind & {
    velocity: v3;
};

export const particleCount = (p: ReadonlyDeep<ParticleKind>) => {
    if (p.content === "gamma") { return 1; };
    return p.content.red + p.content.green + p.content.blue;
}

export const particleMass = (p: ReadonlyDeep<ParticleKind>) => {
    if (p.content === "gamma") { return 0; };
    const count = particleCount(p);
    if (count === 1) { return 1; };
    if (count === 2) { return 1; }
    if (count === 3) { return 2; }
    if (count === 4) { return 4; }
    return 999999;
}

export const particleMomentum = (p: ReadonlyDeep<Particle>) =>
    v3.scale(p.velocity, (particleMass(p) || 1) * hg.cubeLen(p.velocity));

export const particleEnegry = (p: ReadonlyDeep<Particle>) =>
    particleMass(p) + hg.cubeLen(particleMomentum(p));
