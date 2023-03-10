import { ParticleKindDecoder } from "../terms/ParticleKind";
import * as D from "io-ts/Decoder";
import { decode } from "./keyifyUtils";

export const ActorDecoder = D.union(
    D.struct({
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
        kind: D.literal("mirror"),
        direction: D.union(
            // todo: in fact, mirrors have olny 6 unique halfdirections
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
    //     kind: D.literal("reactor"),
    // }),
    D.struct({
        kind: D.literal("trap"),
    }),
    D.struct({
        kind: D.literal("consumer"),
        input: ParticleKindDecoder,
    }),
);
export type Actor = D.TypeOf<typeof ActorDecoder>;
export type SpawnerActor = Extract<Actor, { kind: "spawner" }>;

export const keyProjectActor = decode(ActorDecoder);