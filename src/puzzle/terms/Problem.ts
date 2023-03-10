import { Stringify } from "../../utils/Stringify";
import { isParticleKindKey } from "../terms/ParticleKind";
import { puzzleId } from "./puzzleId";
import memoize from "memoizee";
import * as D from "io-ts/Decoder";
import * as DEx from "../../utils/DecoderEx";
import { isPositionKey } from "./Position";
import { ActorDecoder } from "./Actor";
import { decode, eqByKey } from "./keyifyUtils";


export const ProblemDecoder = D.struct({
    puzzleId: D.literal(puzzleId),
    spawners: DEx.keyRefinedRecord(
        D.refine(isParticleKindKey, "ParticleKindKey")(D.string),
        D.number),
    consumers: DEx.keyRefinedRecord(
        D.refine(isParticleKindKey, "ParticleKindKey")(D.string),
        D.number),
    demand: DEx.keyRefinedRecord(
        D.refine(isParticleKindKey, "ParticleKindKey")(D.string),
        D.number),
    positions: DEx.refinedSet(D.refine(isPositionKey, "PositionKey")(D.string)),
    positionsMode: D.union(D.literal("ban"), D.literal("allow")),
    actors: DEx.keyRefinedRecord(
        D.refine(isPositionKey, "PositionKey")(D.string),
        ActorDecoder),
});

export type Problem = D.TypeOf<typeof ProblemDecoder>;
export type ProblemKey = Stringify<Problem>;
export const keyProjectProblem = decode(ProblemDecoder);
export const _keyifyProblem = (x: Problem) =>
    JSON.stringify(keyProjectProblem(x)) as ProblemKey;
export const keyifyProblem = memoize(_keyifyProblem, { max: 1000 });
export const eqProblem = eqByKey(keyifyProblem);