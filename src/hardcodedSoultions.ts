import { problem1, problem2, problem3, problem5 } from "./puzzle/problems";
import { Solution } from "./puzzle/terms";

export const problem1Empty: Solution = {
    problem: problem1,
    actors: [],
}

export const problem2Empty: Solution = {
    problem: problem2,
    actors: [],
}

export const problem5Empty: Solution = {
    problem: problem5,
    actors: [],
}

export const problem5Solution: Solution = {
    problem: problem5,
    actors: [
        {
            "kind": "spawner",
            "output": {
                content: { red: 0, green: 1, blue: 0, },
            },
            "direction": 0,
            "position": [
                0,
                -4
            ]
        },
        {
            "direction": 8,
            "kind": "mirror",
            "position": [
                0,
                3
            ]
        },
        {
            "direction": 6,
            "kind": "mirror",
            "position": [
                1,
                3
            ]
        },
        {
            "direction": 4,
            "kind": "mirror",
            "position": [
                3,
                1
            ]
        },
        {
            "kind": "consumer",
            "input": {
                content: { red: 0, green: 2, blue: 0, },
            },
            "position": [
                -5,
                4
            ]
        },
        {
            "kind": "consumer",
            "input": {
                content: { red: 2, green: 0, blue: 0, },
            },
            "position": [
                6,
                -7
            ]
        },
        {
            "kind": "spawner",
            "output": {
                content: { red: 4, green: 0, blue: 0, },
            },
            "direction": 2,
            "position": [
                5,
                -2
            ]
        },
        {
            "kind": "trap",
            "position": [
                2,
                -2
            ]
        },
        {
            "direction": 2,
            "kind": "mirror",
            "position": [
                3,
                -1
            ]
        }
    ]
}


export const fourSpawnersParallel: Solution = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [8, 8],
    }, {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0, }, },
        position: [3, 5],
    }],
}



export const fillerSolution1: Solution = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-2, 13],
    }],
}



export const fillerSolution2: Solution = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [8, 8],
    }, {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0, }, },
        position: [3, 5],
    }],
}


export const oneSpawnerSequential: Solution = {
    problem: problem3,
    actors: [{
        direction: 0,
        kind: "mirror",
        position: [2, -1]
    },
    {
        direction: 2,
        kind: "mirror",
        position: [4, -1]
    },
    {
        direction: 4,
        kind: "mirror",
        position: [4, 1]
    },
    {
        direction: 4,
        kind: "spawner",
        output: { content: { red: 1, green: 0, blue: 0, }, },
        position: [-11, 12]
    },
    {
        direction: 6,
        kind: "mirror",
        position: [-3, 8]
    },
    {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0, }, },
        position: [-7, 5]
    },
    {
        direction: 0,
        kind: "mirror",
        position: [-7, 2]
    }]
}
