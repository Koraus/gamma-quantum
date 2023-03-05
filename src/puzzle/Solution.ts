import { keyProjectProblem, ProblemDecoder } from "./Problem";
import { keyProjectParticleKind, ParticleKindDecoder } from "./Particle";
import { sortedByKey } from "../utils/sortedByKey";
import memoize from "memoizee";
import * as D from "../utils/DecoderEx";

export const SolutionDecoder = D.struct({
    problem: ProblemDecoder,
    // make actors record by position
    actors: D.array(D.union(
        D.struct({
            position: D.tuple(D.number, D.number),
            kind: D.literal("spawner"),
            direction: D.union(
                D.literal(0),
                D.literal(1),
                D.literal(2),
                D.literal(3),
                D.literal(4),
                D.literal(5),
            ),
            output: ParticleKindDecoder,
        }),
        D.struct({
            position: D.tuple(D.number, D.number),
            kind: D.literal("mirror"),
            direction: D.union(
                D.literal(0),
                D.literal(1),
                D.literal(2),
                D.literal(3),
                D.literal(4),
                D.literal(5),
                D.literal(6),
                D.literal(7),
                D.literal(8),
                D.literal(9),
                D.literal(10),
                D.literal(11),
            ),
        }),
        // D.struct({
        //     position: D.tuple(D.number, D.number),
        //     kind: D.literal("reactor"),
        // }),
        D.struct({
            position: D.tuple(D.number, D.number),
            kind: D.literal("trap"),
        }),
        D.struct({
            position: D.tuple(D.number, D.number),
            kind: D.literal("consumer"),
            input: ParticleKindDecoder,
        }),
    )),
    solvedAtStep: D.number,
});

export type Solution = D.TypeOf<typeof SolutionDecoder>;
export type Actor = Solution["actors"][number];
export type SpawnerActor = Extract<Actor, { kind: "spawner" }>;
export type SolutionDraft = Omit<Solution, "solvedAtStep">;

const keyProjectActor = (actor: Actor): Actor => {
    switch (actor.kind) {
        case "spawner": {
            const { position, kind, direction, output } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                direction,
                output: keyProjectParticleKind(output),
            };
        }
        case "mirror": {
            const { position, kind, direction } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                direction,
            };
        }
        case "trap": {
            const { position, kind } = actor;
            return {
                position: [position[0], position[1]],
                kind,
            };
        }
        case "consumer": {
            const { position, kind, input } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                input: keyProjectParticleKind(input),
            };
        }
    }
}; 
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

export const isSolutionComplete =
    (s: Solution | SolutionDraft): s is Solution => {
        if (!("solvedAtStep" in s)) { return false; }
        // simulate and check?
        // solution can come from:
        //   at stats server context:
        //     from post - not trusted, 
        //       but should be validated, 
        //       and simulation can be part of validation
        //     from saved state - trusted
        //   at client context
        //     from saved solutions - trusted, why not
        //     as current solution - trusted
        return true;
    };

// todo: can I merge
// - type declaration + io-assertion -- merged using io-ts
// - keyification (specifically key-projection)
// into a single source of truth?