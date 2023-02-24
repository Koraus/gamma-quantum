import { Problem, Solution } from "./puzzle/terms";

const problem1: Problem = {
    spawners: [
        { content: "red" },
        { content: "red" },
        { content: "red" },
        { content: "red" },
    ],
    consumers: [
        { content: ["red", "red", "red", "red"] }
    ],
    demand: [
        [{ content: ["red", "red", "red", "red"] }, 10]
    ],
};

export const fourSpawnersParallel: Solution = {
    problem: problem1,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: "red" },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: "red" },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: "red" },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: "red" },
        position: [8, 8],
    }, {
        kind: "consumer",
        direction: 2,
        input: { content: ["red", "red", "red", "red"] },
        position: [3, 5],
    }],
}



export const fillerSolution1: Solution = {
    problem: problem1,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: "red" },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: "red" },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: "red" },
        position: [-2, 13],
    }],
}



export const fillerSolution2: Solution = {
    problem: problem1,
    actors: [{
        kind: "spawner",
        direction: 4,
        output: { content: "red" },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: "red" },
        position: [8, 8],
    }, {
        kind: "consumer",
        direction: 2,
        input: { content: ["red", "red", "red", "red"] },
        position: [3, 5],
    }],
}


export const oneSpawnerSequential: Solution = {
    problem: problem1,
    actors: [{
        direction: 0,
        kind: "mirror",
        position: [2, -1]
    },
    {
        direction: 1,
        kind: "mirror",
        position: [4, -1]
    },
    {
        direction: 2,
        kind: "mirror",
        position: [4, 1]
    },
    {
        direction: 4,
        kind: "spawner",
        output: { content: "red" },
        position: [-11, 12]
    },
    {
        direction: 3,
        kind: "mirror",
        position: [-3, 8]
    },
    {
        direction: 0,
        kind: "consumer",
        input: { content: ["red", "red", "red", "red"] },
        position: [-7, 5]
    },
    {
        direction: 0,
        kind: "mirror",
        position: [-7, 2]
    }]
}
