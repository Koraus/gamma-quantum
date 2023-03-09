import { Stringify } from "../../utils/Stringify";
import { isParticleKindKey } from "../terms/ParticleKind";
import { puzzleId } from "../puzzleId";
import memoize from "memoizee";
import * as D from "../../utils/DecoderEx";
import { isPositionKey } from "./Position";
import { ActorDecoder } from "./Actor";


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
    positions: D.record2(D.literal(true), {
        checkKeyOrder: true,
        refineKey: isPositionKey,
    }),
    positionsMode: D.union(D.literal("ban"), D.literal("allow")),
    actors: D.record2(ActorDecoder, {
        checkKeyOrder: true,
        refineKey: isPositionKey,
    }),
});

export const keyRefineSortRecord = <K extends string, T>(
    obj: Partial<Record<K, T>>,
    refineKey: (key: string) => key is K,
) => Object.fromEntries(
    Object.entries(obj)
        .filter((a) => refineKey(a[0]))
        .sort((a, b) => a[0].localeCompare(b[0], "en")),
) as Partial<Record<K, T>>;

export type Problem = D.TypeOf<typeof ProblemDecoder>;
export const keyProjectProblem = ({
    puzzleId,
    spawners,
    consumers,
    demand,
    positions,
    positionsMode,
    actors,
}: Problem): Problem => ({
    puzzleId,
    spawners: keyRefineSortRecord(spawners, isParticleKindKey),
    consumers: keyRefineSortRecord(consumers, isParticleKindKey),
    demand: keyRefineSortRecord(demand, isParticleKindKey),
    positions: keyRefineSortRecord(positions, isPositionKey),
    positionsMode,
    actors: keyRefineSortRecord(actors, isPositionKey),
});
export type ProblemKey = Stringify<Problem>;
export const _keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;

export const keyifyProblem = memoize(_keyifyProblem, { max: 1000 });
export const eqProblem = (a: Problem, b: Problem) =>
    keyifyProblem(a) === keyifyProblem(b);