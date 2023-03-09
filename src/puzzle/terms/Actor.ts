import { ParticleKindDecoder, keyProjectParticleKind } from "../terms/ParticleKind";
import * as D from "../../utils/DecoderEx";
import { PositionDecoder, keyProjectPosition } from "./Position";
import { decode } from "./keyifyUtils";

export const ActorDecoder = D.union(
    D.struct({
        position: PositionDecoder,
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
        position: PositionDecoder,
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
        position: PositionDecoder,
        kind: D.literal("trap"),
    }),
    D.struct({
        position: PositionDecoder,
        kind: D.literal("consumer"),
        input: ParticleKindDecoder,
    }),
);
export type Actor = D.TypeOf<typeof ActorDecoder>;
export type SpawnerActor = Extract<Actor, { kind: "spawner" }>;

export const keyProjectActor = decode(ActorDecoder);