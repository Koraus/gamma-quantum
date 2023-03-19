import { Problem, keyifyProblem } from "../../puzzle/terms/Problem";
import { Solution, keyifySolution } from "../../puzzle/terms/Solution";
import { solutionStats } from "../../puzzle/world";


type Stats = ReturnType<typeof solutionStats>;
export type StatsKey = keyof Stats;
export type StatData = Record<number, {
    all: number,
    unique: number,
}>;
export type StatsData = Record<StatsKey, StatData>;

const useProdBackInDev = true;
const backUrl = (useProdBackInDev || !import.meta.env.DEV)
    ? "https://gamma.x-pl.art/"
    : "http://127.0.0.1:8787/";

export const getStats = async (problem: Problem) => {
    const url = new URL(backUrl);
    url.searchParams.append("problem", keyifyProblem(problem));
    const res = await fetch(url);
    const data = await res.json();
    return data as StatsData;
};

export const postSolution = async (solution: Solution) => {
    const res = await fetch(backUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: keyifySolution(solution),
    });
    return (await res.json()) as {
        isNotOriginal: Record<StatsKey, true>,
        data: StatsData,
    };
};