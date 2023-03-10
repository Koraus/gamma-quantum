import { problem3, problem5, sandbox } from "../puzzle/problems";
import { keyifyPosition } from "../puzzle/terms/Position";
import { SolutionDraft } from "../puzzle/terms/Solution";



export const problem5Solution: SolutionDraft = {
    problem: problem5,
    actors: {
        [keyifyPosition([0, -4])]: {
            "kind": "spawner",
            "output": {
                content: { red: 1, green: 0, blue: 0 },
            },
            "direction": 0,
        },
        [keyifyPosition([0, 3])]: {
            "direction": 8,
            "kind": "mirror",
        },
        [keyifyPosition([1, 3])]: {
            "direction": 6,
            "kind": "mirror",
        },
        [keyifyPosition([3, 1])]: {
            "direction": 4,
            "kind": "mirror",
        },
        [keyifyPosition([-5, 4])]: {
            "kind": "consumer",
            "input": {
                content: { red: 2, green: 0, blue: 0 },
            },
        },
        [keyifyPosition([6, -7])]: {
            "kind": "consumer",
            "input": {
                content: { red: 0, green: 2, blue: 0 },
            },
        },
        [keyifyPosition([5, -2])]: {
            "kind": "spawner",
            "output": {
                content: { red: 0, green: 4, blue: 0 },
            },
            "direction": 2,
        },
        [keyifyPosition([2, -2])]: {
            "kind": "trap",
        },
        [keyifyPosition([3, -1])]: {
            "direction": 2,
            "kind": "mirror",
        },
    },
};


export const fourSpawnersParallel: SolutionDraft = {
    problem: problem3,
    actors: {
        [keyifyPosition([-2, 2])]: {
            kind: "spawner",
            direction: 5,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([8, -3])]: {
            kind: "spawner",
            direction: 1,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([-2, 13])]: {
            kind: "spawner",
            direction: 4,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([8, 8])]: {
            kind: "spawner",
            direction: 2,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([3, 5])]: {
            kind: "consumer",
            input: { content: { red: 4, green: 0, blue: 0 } },
        },
    },
};



export const fillerSolution1: SolutionDraft = {
    problem: problem3,
    actors: {
        [keyifyPosition([-2, 2])]: {
            kind: "spawner",
            direction: 5,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([8, -3])]: {
            kind: "spawner",
            direction: 1,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([-2, 13])]: {
            kind: "spawner",
            direction: 4,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
    },
};



export const fillerSolution2: SolutionDraft = {
    problem: problem3,
    actors: {
        [keyifyPosition([-2, 13])]: {
            kind: "spawner",
            direction: 4,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([8, 8])]: {
            kind: "spawner",
            direction: 2,
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([3, 5])]: {
            kind: "consumer",
            input: { content: { red: 4, green: 0, blue: 0 } },
        },
    },
};


export const oneSpawnerSequential: SolutionDraft = {
    problem: problem3,
    actors: {
        [keyifyPosition([2, -1])]: {
            direction: 0,
            kind: "mirror",
        },
        [keyifyPosition([4, -1])]: {
            direction: 2,
            kind: "mirror",
        },
        [keyifyPosition([4, 1])]: {
            direction: 4,
            kind: "mirror",
        },
        [keyifyPosition([-11, 12])]: {
            direction: 4,
            kind: "spawner",
            output: { content: { red: 1, green: 0, blue: 0 } },
        },
        [keyifyPosition([-3, 8])]: {
            direction: 6,
            kind: "mirror",
        },
        [keyifyPosition([-7, 5])]: {
            kind: "consumer",
            input: { content: { red: 4, green: 0, blue: 0 } },
        },
        [keyifyPosition([-7, 2])]: {
            direction: 0,
            kind: "mirror",
        },
    },
};

export const demo1: SolutionDraft = {
    "problem": sandbox,
    "actors": {
        [keyifyPosition([-6, 3])]: {
            "kind": "spawner",
            "output": {
                "content": "gamma",
            },
            "direction": 0,
        },
        [keyifyPosition([-2, 9])]: {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 1,
                    "green": 0,
                    "blue": 0,
                },
            },
            "direction": 1,
        },
        [keyifyPosition([-6, 14])]: {
            "direction": 5,
            "kind": "mirror",
        },
        [keyifyPosition([-9, 16])]: {
            "direction": 7,
            "kind": "mirror",
        },
        [keyifyPosition([-12, 14])]: {
            "direction": 8,
            "kind": "mirror",
        },
        [keyifyPosition([-12, 10])]: {
            "direction": 10,
            "kind": "mirror",
        },
        [keyifyPosition([-4, 2])]: {
            "direction": 2,
            "kind": "mirror",
        },
        [keyifyPosition([11, 7])]: {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 0,
                    "blue": 1,
                },
            },
            "direction": 3,
        },
        [keyifyPosition([-9, -5])]: {
            "direction": 11,
            "kind": "mirror",
        },
        [keyifyPosition([11, -5])]: {
            "direction": 2,
            "kind": "mirror",
        },
        [keyifyPosition([11, 1])]: {
            "direction": 4,
            "kind": "mirror",
        },
        [keyifyPosition([-8, 20])]: {
            "direction": 7,
            "kind": "mirror",
        },
        [keyifyPosition([20, -5])]: {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 1,
                    "green": 0,
                    "blue": 0,
                },
            },
            "direction": 1,
        },
        [keyifyPosition([13, -1])]: {
            "direction": 3,
            "kind": "mirror",
        },
        [keyifyPosition([-19, -1])]: {
            "direction": 11,
            "kind": "mirror",
        },
        [keyifyPosition([-19, 12])]: {
            "direction": 8,
            "kind": "mirror",
        },
        [keyifyPosition([1, 12])]: {
            "direction": 5,
            "kind": "mirror",
        },
        [keyifyPosition([-10, 4])]: {
            "direction": 8,
            "kind": "mirror",
        },
        [keyifyPosition([-10, 0])]: {
            "direction": 1,
            "kind": "mirror",
        },
        [keyifyPosition([-14, 4])]: {
            "direction": 6,
            "kind": "mirror",
        },
        [keyifyPosition([-25, 1])]: {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 1,
                    "blue": 0,
                },
            },
            "direction": 0,
        },
        [keyifyPosition([-28, 7])]: {
            "kind": "spawner",
            "output": {
                "content": {
                    "red": 0,
                    "green": 1,
                    "blue": 0,
                },
            },
            "direction": 4,
        },
        [keyifyPosition([-26, 17])]: {
            "direction": 7,
            "kind": "mirror",
        },
        [keyifyPosition([-23, 14])]: {
            "direction": 4,
            "kind": "mirror",
        },
        [keyifyPosition([-23, 11])]: {
            "direction": 2,
            "kind": "mirror",
        },
        [keyifyPosition([-26, 11])]: {
            "direction": 11,
            "kind": "mirror",
        },
        [keyifyPosition([-26, 15])]: {
            "direction": 11,
            "kind": "mirror",
        },
    },
};