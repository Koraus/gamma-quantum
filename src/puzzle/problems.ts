import { keyifyParticleKind, ParticleKindKey } from "./Particle";
import { Problem } from "./Problem";


export const problem1: Problem = {
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 2,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 10,
    },
};

export const problem2: Problem = {
    spawners: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 1,
        [keyifyParticleKind({ content: "gamma" })]: 1,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 10,
    },
};


export const problem3: Problem = {
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 4,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 10,
    },
};


export const problem4: Problem = {
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 2,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 10,
    },
};

export const problem5: Problem = {
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 1,
        [keyifyParticleKind({ content: { red: 0, green: 4, blue: 0 } })]: 1,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 1,
        [keyifyParticleKind({ content: { red: 0, green: 2, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 10,
        [keyifyParticleKind({ content: { red: 0, green: 2, blue: 0 } })]: 10,
    },
}