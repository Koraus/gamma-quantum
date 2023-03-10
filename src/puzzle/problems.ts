import { keyifyParticleKind } from "./terms/ParticleKind";
import { keyifyPosition } from "./terms/Position";
import { Problem } from "./terms/Problem";
import { puzzleId } from "./terms/puzzleId";

export const problem0: Problem = {
    puzzleId,
    spawners: {},
    consumers: {},
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 10,
    },
    positions: {
        [keyifyPosition([0, 0])]: true,
        [keyifyPosition([0, 1])]: true,
        [keyifyPosition([0, -1])]: true,
        [keyifyPosition([1, -1])]: true,
        [keyifyPosition([1, 0])]: true,
        [keyifyPosition([-1, 0])]: true,
        [keyifyPosition([-1, 1])]: true,
    },
    positionsMode: "allow",
    actors: {
        [keyifyPosition([4, 0])]: {
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
            direction: 2,
        },
        [keyifyPosition([-4, 1])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 0, blue: 0 } },
        },
    },
};

export const problem1: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 2,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 10,
    },
    positions: {},
    positionsMode: "ban",
    actors: {},
};

export const problem2: Problem = {
    puzzleId,
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
    positions: {},
    positionsMode: "ban",
    actors: {},
};


export const problem3: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 4,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 10,
    },
    positions: {},
    positionsMode: "ban",
    actors: {},
};


export const problem4: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 2,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 10,
    },
    positions: {},
    positionsMode: "ban",
    actors: {},
};

export const problem5: Problem = {
    puzzleId,
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
    positions: {},
    positionsMode: "ban",
    actors: {},
};

export const sandbox: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: "gamma" })]: 4,
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 2, green: 0, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 3, green: 0, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 4, green: 0, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 2, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 3, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 4, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 0, blue: 1 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 0, blue: 2 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 0, blue: 3 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 0, blue: 4 } })]: 4,
        [keyifyParticleKind({ content: { red: 1, green: 1, blue: 0 } })]: 4,
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 1 } })]: 4,
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 1 } })]: 4,
        [keyifyParticleKind({ content: { red: 1, green: 1, blue: 1 } })]: 4,
    },
    consumers: {

    },
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 9999,
    },
    positions: {},
    positionsMode: "ban",
    actors: {},
};