import { v3 } from "../utils/v";

export type Problem = undefined;

export type IntRange_0Inc_5Inc = 0 | 1 | 2 | 3 | 4 | 5;

export type Particle = {
    content:
        "gamma" 
        | "red"
        | "green"
        | "blue"
        | ["red", "green"]
        | ["red", "blue"]
        | ["green", "blue"]
        | ["red", "green", "blue"],
}


export type Actor = {
    position: v3,
    direction: IntRange_0Inc_5Inc,
} & ({
    kind: "mirror",
} | {
    kind: "reactor",
} | {
    kind: "spawner",
    output: Particle,
});

export type Solution = {
    problem: Problem,
    actors: Actor[],
}