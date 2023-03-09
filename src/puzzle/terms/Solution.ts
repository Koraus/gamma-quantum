import { keyProjectProblem, ProblemDecoder } from "./Problem";
import { sortedByKey } from "../../utils/sortedByKey";
import memoize from "memoizee";
import * as D from "../../utils/DecoderEx";
import { ActorDecoder, keyProjectActor } from "./Actor";


export const SolutionDecoder = D.struct({
    problem: ProblemDecoder,
    // make actors record by position
    actors: D.array(ActorDecoder),
    solvedAtStep: D.number,
});
export type Solution = D.TypeOf<typeof SolutionDecoder>;
export type SolutionDraft = Omit<Solution, "solvedAtStep">;
export const keyProjectSolutionDraft = ({
    problem,
    actors,
}: SolutionDraft): SolutionDraft => ({
    problem: keyProjectProblem(problem),
    actors: sortedByKey(actors, a => JSON.stringify(keyProjectActor(a))),
});
export type SolutionDraftKey =
    // Stringify<Solution>; // too complex
    `{"problem":${string},"actors":${string}}`;
export const _keyifySolutionDraft = (x: SolutionDraft) =>
    JSON.stringify(keyProjectSolutionDraft(x)) as SolutionDraftKey;
export const keyifySolutionDraft = memoize(_keyifySolutionDraft, { max: 1000 });
export const parseSolutionDraft = (x: SolutionDraftKey) =>
    JSON.parse(x) as Solution;
export const eqSolutionDraft = (a: SolutionDraft, b: SolutionDraft) =>
    keyifySolutionDraft(a) === keyifySolutionDraft(b);

export type Solution1 = SolutionDraft & {
    solvedAtStep: number;
}
export const keyProjectSolution = ({
    problem,
    actors,
    solvedAtStep,
}: Solution): Solution => ({
    problem: keyProjectProblem(problem),
    actors: sortedByKey(actors, a => JSON.stringify(keyProjectActor(a))),
    solvedAtStep,
});
export type SolutionKey =
    // Stringify<Solution>; // too complex
    `{"problem":${string},"actors":${string},"solvedAtStep":${number}}`;
export const _keyifySolution = (x: Solution) =>
    JSON.stringify(keyProjectSolution(x)) as SolutionKey;
export const keyifySolution = memoize(_keyifySolution, { max: 1000 });
export const parseSolution = (x: SolutionKey) =>
    JSON.parse(x) as Solution;
export const eqSolution = (a: Solution, b: Solution) =>
    keyifySolution(a) === keyifySolution(b);

export const isSolutionComplete = (
    s: Solution | SolutionDraft,
): s is Solution =>
    ("solvedAtStep" in s);

// todo: can I merge
// - type declaration + io-assertion -- merged using io-ts
// - keyification (specifically key-projection)
// into a single source of truth?