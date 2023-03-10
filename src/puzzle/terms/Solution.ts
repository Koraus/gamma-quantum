import { pipe } from "fp-ts/lib/function";
import { ProblemDecoder } from "./Problem";
import memoize from "memoizee";
import * as D from "io-ts/Decoder";
import * as DEx from "../../utils/DecoderEx";
import { ActorDecoder } from "./Actor";
import { isPositionKey } from "./Position";
import { decode, eqByKey } from "./keyifyUtils";
import { ShallowStringify } from "../../utils/Stringify";


export const SolutionDraftDecoder = pipe(
    D.struct({
        problem: ProblemDecoder,
        actors: DEx.keyRefinedRecord(
            D.refine(isPositionKey, "PositionKey")(D.string),
            ActorDecoder),
    }),
    D.refine(
        (x): x is typeof x =>
            Object.keys(x.actors).every(k => !(k in x.problem.actors)),
        "solution actors do not overwrite problem actors"),
    D.refine(
        (x): x is typeof x =>
            Object.keys(x.actors).every(k => {
                switch (x.problem.positionsMode) {
                    case "ban": return !(k in x.problem.positions);
                    case "allow": return (k in x.problem.positions);
                }
            }),
        "solution actors positions are allowed / not banned"),
);
export type SolutionDraft = D.TypeOf<typeof SolutionDraftDecoder>;
export type SolutionDraftKey = ShallowStringify<SolutionDraft>;
export const keyProjectSolutionDraft = decode(SolutionDraftDecoder);
export const _keyifySolutionDraft = (x: SolutionDraft) =>
    JSON.stringify(keyProjectSolutionDraft(x)) as SolutionDraftKey;
export const keyifySolutionDraft = memoize(_keyifySolutionDraft, { max: 1000 });
export const parseSolutionDraft = (x: SolutionDraftKey) =>
    JSON.parse(x) as Solution;
export const eqSolutionDraft = eqByKey(keyifySolutionDraft);


export const SolutionDecoder = D.intersect(SolutionDraftDecoder)(D.struct({
    solvedAtStep: D.number,
}));
export type Solution = D.TypeOf<typeof SolutionDecoder>;
export type SolutionKey = ShallowStringify<Solution>;
export const keyProjectSolution = decode(SolutionDecoder);
export const _keyifySolution = (x: Solution) =>
    JSON.stringify(keyProjectSolution(x)) as SolutionKey;
export const keyifySolution = memoize(_keyifySolution, { max: 1000 });
export const parseSolution = (x: SolutionKey) =>
    JSON.parse(x) as Solution;
export const eqSolution = eqByKey(keyifySolution);

export const isSolutionComplete = (
    s: Solution | SolutionDraft,
): s is Solution =>
    ("solvedAtStep" in s);
