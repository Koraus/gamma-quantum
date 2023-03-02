import { sortKeys } from "../utils/sortKeys";
import { Stringify } from "../utils/Stringify";
import { ParticleKindKey } from "./Particle";
import { puzzleId } from "./puzzleId";


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
export const keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;
