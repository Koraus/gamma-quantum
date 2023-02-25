import { Problem } from "./terms";

export const problem1: Problem = {
    spawners: [
        { content: "red" },
        { content: "red" },
    ],
    consumers: [
        { content: ["red", "red"] }
    ],
    demand: [
        [{ content: ["red", "red"] }, 10]
    ],
};

export const problem2: Problem = {
    spawners: [
        { content: ["red", "red"] },
        { content: "gamma" },
    ],
    consumers: [
        { content: "red" }
    ],
    demand: [
        [{ content: "red" }, 10]
    ],
};


export const problem3: Problem = {
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


export const problem4: Problem = {
    spawners: [
        { content: "red" },
    ],
    consumers: [
        { content: ["red", "red", "red", "red"] }
    ],
    demand: [
        [{ content: ["red", "red", "red", "red"] }, 10]
    ],
};

export const problem5: Problem = {
    spawners: [
        { content: "green" },
        { content: ["red", "red", "red", "red"] },
    ],
    consumers: [
        { content: ["red", "red"] },
        { content: ["green", "green"] },
    ],
    demand: [
        [{ content: ["red", "red"] }, 10],
        [{ content: ["green", "green"] }, 10],
    ],
}