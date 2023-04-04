import { sandbox } from "../../puzzle/problems";
import { keyifyPosition } from "../../puzzle/terms/Position";
import { SolutionDraft } from "../../puzzle/terms/Solution";


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