import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { ReadonlyDeep } from "../utils/ReadonlyDeep";
import { Stringify } from "../utils/Stringify";
import * as D from "../utils/DecoderEx";

export const ParticleKindDecoder = D.struct({
    content: D.union(
        D.literal("gamma"),
        D.struct({
            red: D.number, // 0, 1, 2, ...
            green: D.number, // 0, 1, 2, ...
            blue: D.number, // 0, 1, 2, ...
            // todo: but not all zeros
        }),
    ),
});


export type ParticleKind = D.TypeOf<typeof ParticleKindDecoder>;

export const keyProjectParticleKind = ({
    content,
}: ParticleKind): ParticleKind => ({
    content: content === "gamma"
        ? content
        : { red: content.red, green: content.green, blue: content.blue },
});
export type ParticleKindKey = Stringify<ParticleKind>;
export const isParticleKindKey = (key: unknown): key is ParticleKindKey => {
    if ("string" !== typeof key) { return false; }
    const parsed = (() => {
        try { return JSON.parse(key); } catch { /* mute */ }
    })();
    if (!parsed) { return false; }
    return D.guard(ParticleKindDecoder, parsed);
};
export const keyifyParticleKind = (x: ParticleKind) =>
    JSON.stringify(keyProjectParticleKind(x)) as ParticleKindKey;
export const parsePartilceKind = (key: ParticleKindKey) => {
    const parsed = JSON.parse(key);
    D.assert(ParticleKindDecoder, parsed);
    return parsed;
};
export const eqParticleKind = (a: ParticleKind, b: ParticleKind) =>
    keyifyParticleKind(a) === keyifyParticleKind(b);

export type Particle = ParticleKind & {
    velocity: v3;
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
    v3.scale(p.velocity, (particleMass(p) || 1) * hg.cubeLen(p.velocity));

export const particlesMomentum = (ps: Iterable<ReadonlyDeep<Particle>>) =>
    ps[Symbol.iterator]()
        .map(particleMomentum)
        .reduce(...v3.sumReducer());

export const particleEnergy = (p: ReadonlyDeep<Particle>) =>
    particleMass(p) + hg.cubeLen(particleMomentum(p));

export const particlesEnergy = (ps: Iterable<ReadonlyDeep<Particle>>) =>
    ps[Symbol.iterator]()
        .map(particleEnergy)
        .reduce((acc, v) => acc + v, 0);