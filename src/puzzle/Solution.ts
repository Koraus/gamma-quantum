import { keyProjectProblem, Problem, ProblemKey } from "./Problem";
import { v2 } from "../utils/v";
import { ParticleKind } from "./Particle";
import { DirectionId, HalfDirectionId } from "./direction";
import { sortedByKey } from "../utils/sortedByKey";

export type SpawnerActor = {
    position: v2,
    kind: "spawner",
    direction: DirectionId,
    output: ParticleKind,
};

export type Actor = {
    position: v2,
} & ({
    kind: "mirror",
    direction: HalfDirectionId,
} | {
    kind: "reactor",
} | {
    kind: "trap",
} | {
    kind: "consumer",
    input: ParticleKind,
}) | SpawnerActor;

const keyProjectActor = (actor: Actor): Actor => actor; // todo: implement

export type SolutionDraft = {
    problem: Problem;
    actors: Actor[];
};

export type Solution = SolutionDraft & {
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
    `{"problem":${string}}`;
export const keyifySolution = (x: Solution) =>
    JSON.stringify(keyProjectSolution(x)) as SolutionKey;
export const parseSolution = (x: SolutionKey) =>
    JSON.parse(x) as Solution;

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