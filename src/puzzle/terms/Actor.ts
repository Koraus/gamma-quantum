import { ParticleKindDecoder, keyProjectParticleKind } from "./Particle";
import * as D from "../../utils/DecoderEx";

export const ActorDecoder = D.union(
    D.struct({
        position: D.tuple(D.number, D.number),
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
        position: D.tuple(D.number, D.number),
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
        position: D.tuple(D.number, D.number),
        kind: D.literal("trap"),
    }),
    D.struct({
        position: D.tuple(D.number, D.number),
        kind: D.literal("consumer"),
        input: ParticleKindDecoder,
    }),
);
export type Actor = D.TypeOf<typeof ActorDecoder>;
export type SpawnerActor = Extract<Actor, { kind: "spawner" }>;

export const keyProjectActor = (actor: Actor): Actor => {
    switch (actor.kind) {
        case "spawner": {
            const { position, kind, direction, output } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                direction,
                output: keyProjectParticleKind(output),
            };
        }
        case "mirror": {
            const { position, kind, direction } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                direction,
            };
        }
        case "trap": {
            const { position, kind } = actor;
            return {
                position: [position[0], position[1]],
                kind,
            };
        }
        case "consumer": {
            const { position, kind, input } = actor;
            return {
                position: [position[0], position[1]],
                kind,
                input: keyProjectParticleKind(input),
            };
        }
    }
};
