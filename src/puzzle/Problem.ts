import { sortKeys } from "../utils/sortKeys";
import { Stringify } from "../utils/Stringify";
import { ParticleKindKey } from "./Particle";
import { puzzleId } from "./puzzleId";
import memoize from "memoizee";


export type Problem = {
    puzzleId: typeof puzzleId;
    spawners: Partial<Record<ParticleKindKey, number>>;
    consumers: Partial<Record<ParticleKindKey, number>>;
    demand: Partial<Record<ParticleKindKey, number>>;
};
export const keyProjectProblem = ({
    puzzleId,
    spawners,
    consumers,
    demand,
}: Problem): Problem => ({
    puzzleId,
    // todo: should I filter out non-ParticleKindKey keys?
    spawners: sortKeys(spawners),
    consumers: sortKeys(consumers),
    demand: sortKeys(demand),
});
export type ProblemKey = Stringify<Problem>;
export const _keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;

export const keyifyProblem = memoize(_keyifyProblem, { max: 1000 });
export const eqProblem = (a: Problem, b: Problem) =>
    keyifyProblem(a) === keyifyProblem(b);