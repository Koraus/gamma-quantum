import { keyifyParticleKind } from "./terms/ParticleKind";
import { keyifyPosition } from "./terms/Position";
import { Problem } from "./terms/Problem";
import { puzzleId } from "./terms/puzzleId";
import * as hax from "../utils/hax";
import { v2 } from "../utils/v";


export const _tutorial1: Problem = {
    puzzleId,
    spawners: {},
    consumers: {},
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 3,
    },
    positions: {
        ...Object.fromEntries(
            hax.disc(3)[Symbol.iterator]()
                .map(h => [keyifyPosition(h), true])),
    },
    positionsMode: "allow",
    actors: {
        [keyifyPosition([4, -4])]: {
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
            direction: 2,
        },
        [keyifyPosition([0, -4])]: {
            kind: "mirror",
            direction: 5,
        },
        [keyifyPosition([4, 0])]: {
            kind: "mirror",
            direction: 9,
        },
        [keyifyPosition([-1, 5])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 0, blue: 0 } },
        },
    },
};

export const _tutorial2: Problem = {
    puzzleId,
    spawners: {},
    consumers: {},
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 3,
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 3,
    },
    positions: {
        ...Object.fromEntries(
            hax.disc(3)[Symbol.iterator]()
                .map(h => [keyifyPosition(h), true])),
    },
    positionsMode: "allow",
    actors: {
        [keyifyPosition([4, -4])]: {
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
            direction: 1,
        },
        [keyifyPosition([-4, 4])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([0, -4])]: {
            kind: "spawner",
            output: { content: { red: 0, green: 1, blue: 0 } },
            direction: 0,
        },
        [keyifyPosition([0, 4])]: {
            kind: "consumer",
            input: { content: { red: 0, green: 1, blue: 0 } },
        },
    },
};

export const _tutorial3: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 1,
        [keyifyParticleKind({ content: { red: 1, green: 0, blue: 0 } })]: 1,
    },
    consumers: {
    },
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 1, blue: 0 } })]: 6,
    },
    positions: {
        ...Object.fromEntries(
            hax.disc(2)[Symbol.iterator]()
                .map(h => [keyifyPosition(h), true])),
    },
    positionsMode: "allow",
    actors: {
        [keyifyPosition([2, 3])]: {
            kind: "spawner",
            output: { content: { red: 0, green: 1, blue: 0 } },
            direction: 2,
        },
        [keyifyPosition([-3, -2])]: {
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
            direction: 0,
        },
        [keyifyPosition([-3, 6])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 1, blue: 0 } },
        },
        [keyifyPosition([-6, 3])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 1, blue: 0 } },
        },
    },
};


export const _tutorial4: Problem = {
    puzzleId,
    spawners: {
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 1,
    },
    consumers: {
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 1,
    },
    demand: {
        [keyifyParticleKind({ content: { red: 1, green: 1, blue: 0 } })]: 3,
        [keyifyParticleKind({ content: { red: 0, green: 1, blue: 0 } })]: 3,
    },
    positions: {
        ...Object.fromEntries(
            hax.disc(3)[Symbol.iterator]()
                .map(h => [keyifyPosition(h), true])),
        ...Object.fromEntries(
            hax.disc(3)[Symbol.iterator]()
                .map(h => v2.add(h, [6, -2]))
                .map(h => [keyifyPosition(h), true])),
        ...Object.fromEntries(
            hax.disc(1)[Symbol.iterator]()
                .map(h => v2.add(h, [3, 5]))
                .map(h => [keyifyPosition(h), true])),
    },
    positionsMode: "allow",
    actors: {
        [keyifyPosition([5, -5])]: {
            kind: "spawner",
            output: { content: { red: 0, green: 1, blue: 0 } },
            direction: 1,
        },
        [keyifyPosition([-2, -3])]: {
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
            direction: 5,
        },
        [keyifyPosition([2, -5])]: {
            kind: "consumer",
            input: { content: { red: 1, green: 1, blue: 0 } },
        },
    },
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