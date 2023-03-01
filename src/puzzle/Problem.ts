import { sortKeys } from "../utils/sortKeys";
import { Stringify } from "../utils/Stringify";
import { ParticleKindKey } from "./Particle";


export type Problem = {
    spawners: Partial<Record<ParticleKindKey, number>>;
    consumers: Partial<Record<ParticleKindKey, number>>;
    demand: Partial<Record<ParticleKindKey, number>>;
};
export const keyProjectProblem = ({
    spawners,
    consumers,
    demand,
}: Problem) => ({
    // todo: should I filter out non-ParticleKindKey keys?
    spawners: sortKeys(spawners),
    consumers: sortKeys(consumers),
    demand: sortKeys(demand),
});
export type ProblemKey = Stringify<Problem>;
export const keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;
