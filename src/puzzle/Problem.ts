import { Stringify } from "../utils/Stringify";
import { isParticleKindKey } from "./Particle";
import { puzzleId } from "./puzzleId";
import memoize from "memoizee";
import * as D from "../utils/DecoderEx";


export const ProblemDecoder = D.struct({
    puzzleId: D.literal(puzzleId),
    spawners: D.record2(D.number, {
        checkKeyOrder: true,
        refineKey: isParticleKindKey,
    }),
    consumers: D.record2(D.number, {
        checkKeyOrder: true,
        refineKey: isParticleKindKey,
    }),
    demand: D.record2(D.number, {
        checkKeyOrder: true,
        refineKey: isParticleKindKey,
    }),
});

export type Problem = D.TypeOf<typeof ProblemDecoder>;
export const keyProjectProblem = ({
    puzzleId,
    spawners,
    consumers,
    demand,
}: Problem): Problem => ({
    puzzleId,
    spawners: Object.fromEntries(Object.entries(spawners)
        .filter(([key]) => isParticleKindKey(key))
        .sort((a, b) => a[0].localeCompare(b[0], "en"))),
    consumers: Object.fromEntries(Object.entries(consumers)
        .filter(([key]) => isParticleKindKey(key))
        .sort((a, b) => a[0].localeCompare(b[0], "en"))),
    demand: Object.fromEntries(Object.entries(demand)
        .filter(([key]) => isParticleKindKey(key))
        .sort((a, b) => a[0].localeCompare(b[0], "en"))),
});
export type ProblemKey = Stringify<Problem>;
export const _keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;

export const keyifyProblem = memoize(_keyifyProblem, { max: 1000 });
export const eqProblem = (a: Problem, b: Problem) =>
    keyifyProblem(a) === keyifyProblem(b);