import { Solution } from "./puzzle/terms";

export const solution1: Solution = {
    problem: undefined,
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



export const solution2: Solution = {
    problem: undefined,
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



export const solution3: Solution = {
    problem: undefined,
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