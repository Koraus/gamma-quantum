import { pipe } from "fp-ts/lib/function";
import { ProblemDecoder } from "./Problem";
import memoize from "memoizee";
import * as D from "io-ts/Decoder";
import * as DEx from "../../utils/DecoderEx";
import { ActorDecoder } from "./Actor";
import { isPositionKey } from "./Position";
import { decode, eqByKey } from "./keyifyUtils";
import { ShallowStringify } from "../../utils/Stringify";
import { ParticleKindKey, keyifyParticleKind } from "./ParticleKind";
import { trustedEntries, trustedValues } from "../../utils/trustedRecord";


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
    D.refine(
        (x): x is typeof x => {
            const spawners = {} as Partial<Record<ParticleKindKey, number>>;
            const consumers = {} as Partial<Record<ParticleKindKey, number>>;
            for (const a of trustedValues(x.actors)) {
                if (a.kind === "spawner") {
                    const k = keyifyParticleKind(a.output);
                    spawners[k] = (spawners[k] ?? 0) + 1;
                }
                if (a.kind === "consumer") {
                    const k = keyifyParticleKind(a.input);
                    consumers[k] = (consumers[k] ?? 0) + 1;
                }
            }
            return true
                && trustedEntries(spawners)
                    .every(([k, count]) =>
                        (x.problem.spawners[k] ?? 0) >= count)
                && trustedEntries(consumers)
                    .every(([k, count]) =>
                        (x.problem.consumers[k] ?? 0) >= count);
        },
        "solution spawners and consumers do not exceed problem limits"),
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
