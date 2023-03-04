import { problem3, problem5, sandbox } from "../puzzle/problems";
import { SolutionDraft } from "../puzzle/Solution";



export const problem5Solution: SolutionDraft = {
    problem: problem5,
    actors: [
        {
            "kind": "spawner",
            "output": {
                content: { red: 1, green: 0, blue: 0 },
            },
            "direction": 0,
            "position": [
                0,
                -4,
            ],
        },
        {
            "direction": 8,
            "kind": "mirror",
            "position": [
                0,
                3,
            ],
        },
        {
            "direction": 6,
            "kind": "mirror",
            "position": [
                1,
                3,
            ],
        },
        {
            "direction": 4,
            "kind": "mirror",
            "position": [
                3,
                1,
            ],
        },
        {
            "kind": "consumer",
            "input": {
                content: { red: 2, green: 0, blue: 0 },
            },
            "position": [
                -5,
                4,
            ],
        },
        {
            "kind": "consumer",
            "input": {
                content: { red: 0, green: 2, blue: 0 },
            },
            "position": [
                6,
                -7,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                content: { red: 0, green: 4, blue: 0 },
            },
            "direction": 2,
            "position": [
                5,
                -2,
            ],
        },
        {
            "kind": "trap",
            "position": [
                2,
                -2,
            ],
        },
        {
            "direction": 2,
            "kind": "mirror",
            "position": [
                3,
                -1,
            ],
        },
    ],
};


export const fourSpawnersParallel: SolutionDraft = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [8, 8],
    }, {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0 } },
        position: [3, 5],
    }],
};



export const fillerSolution1: SolutionDraft = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-2, 13],
    }],
};



export const fillerSolution2: SolutionDraft = {
    problem: problem3,
    actors: [{
        kind: "spawner",
        direction: 4,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [8, 8],
    }, {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0 } },
        position: [3, 5],
    }],
};


export const oneSpawnerSequential: SolutionDraft = {
    problem: problem3,
    actors: [{
        direction: 0,
        kind: "mirror",
        position: [2, -1],
    },
    {
        direction: 2,
        kind: "mirror",
        position: [4, -1],
    },
    {
        direction: 4,
        kind: "mirror",
        position: [4, 1],
    },
    {
        direction: 4,
        kind: "spawner",
        output: { content: { red: 1, green: 0, blue: 0 } },
        position: [-11, 12],
    },
    {
        direction: 6,
        kind: "mirror",
        position: [-3, 8],
    },
    {
        kind: "consumer",
        input: { content: { red: 4, green: 0, blue: 0 } },
        position: [-7, 5],
    },
    {
        direction: 0,
        kind: "mirror",
        position: [-7, 2],
    }],
};

export const demo1: SolutionDraft = {
    "problem": sandbox,
    "actors": [
        {
            "kind": "spawner",
            "output": {
                "content": "gamma",
            },
            "direction": 0,
            "position": [
                -6,
                3,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 1,
                    "green": 0,
                    "blue": 0,
                },
            },
            "direction": 1,
            "position": [
                -2,
                9,
            ],
        },
        {
            "direction": 5,
            "kind": "mirror",
            "position": [
                -6,
                14,
            ],
        },
        {
            "direction": 7,
            "kind": "mirror",
            "position": [
                -9,
                16,
            ],
        },
        {
            "direction": 8,
            "kind": "mirror",
            "position": [
                -12,
                14,
            ],
        },
        {
            "direction": 10,
            "kind": "mirror",
            "position": [
                -12,
                10,
            ],
        },
        {
            "direction": 2,
            "kind": "mirror",
            "position": [
                -4,
                2,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 0,
                    "blue": 1,
                },
            },
            "direction": 3,
            "position": [
                11,
                7,
            ],
        },
        {
            "direction": 11,
            "kind": "mirror",
            "position": [
                -9,
                -5,
            ],
        },
        {
            "direction": 2,
            "kind": "mirror",
            "position": [
                11,
                -5,
            ],
        },
        {
            "direction": 4,
            "kind": "mirror",
            "position": [
                11,
                1,
            ],
        },
        {
            "direction": 7,
            "kind": "mirror",
            "position": [
                -8,
                20,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 1,
                    "green": 0,
                    "blue": 0,
                },
            },
            "direction": 1,
            "position": [
                20,
                -5,
            ],
        },
        {
            "direction": 3,
            "kind": "mirror",
            "position": [
                13,
                -1,
            ],
        },
        {
            "direction": 11,
            "kind": "mirror",
            "position": [
                -19,
                -1,
            ],
        },
        {
            "direction": 8,
            "kind": "mirror",
            "position": [
                -19,
                12,
            ],
        },
        {
            "direction": 5,
            "kind": "mirror",
            "position": [
                1,
                12,
            ],
        },
        {
            "direction": 8,
            "kind": "mirror",
            "position": [
                -10,
                4,
            ],
        },
        {
            "direction": 1,
            "kind": "mirror",
            "position": [
                -10,
                0,
            ],
        },
        {
            "direction": 6,
            "kind": "mirror",
            "position": [
                -14,
                4,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 1,
                    "blue": 0,
                },
            },
            "direction": 0,
            "position": [
                -25,
                1,
            ],
        },
        {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 1,
                    "blue": 0,
                },
            },
            "direction": 4,
            "position": [
                -28,
                7,
            ],
        },
        {
            "direction": 7,
            "kind": "mirror",
            "position": [
                -26,
                17,
            ],
        },
        {
            "direction": 4,
            "kind": "mirror",
            "position": [
                -23,
                14,
            ],
        },
        {
            "direction": 2,
            "kind": "mirror",
            "position": [
                -23,
                11,
            ],
        },
        {
            "direction": 11,
            "kind": "mirror",
            "position": [
                -26,
                11,
            ],
        },
        {
            "direction": 11,
            "kind": "mirror",
            "position": [
                -26,
                15,
            ],
        },
    ],
};