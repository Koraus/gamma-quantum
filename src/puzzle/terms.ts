import { v2, v3 } from "../utils/v";

export type Problem = undefined;

export type IntRange_0Inc_5Inc = 0 | 1 | 2 | 3 | 4 | 5;
export type DirectionId = IntRange_0Inc_5Inc;

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
    position: v2,
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