import { createKeyify } from "../utils/keyify";
import { sortKeys } from "../utils/sortKeys";
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
    spawners: sortKeys(spawners),
    consumers: sortKeys(consumers),
    demand: sortKeys(demand),
})
export const keyifyProblem = createKeyify(keyProjectProblem);
export type ProblemKey = ReturnType<typeof keyifyProblem>;
