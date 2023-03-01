import { Problem } from "./Problem";
import { v2 } from "../utils/v";
import { ParticleKind } from "./Particle";
import { DirectionId, HalfDirectionId } from "./direction";

export type SpawnerActor = {
    position: v2,
    kind: "spawner",
    direction: DirectionId,
    output: ParticleKind,
};

export type Actor = {
    position: v2,
} & ({  
    kind: "mirror",
    direction: HalfDirectionId,
} | {
    kind: "reactor",
} | {
    kind: "trap",
} | {
    kind: "consumer",
    input: ParticleKind,
}) | SpawnerActor;



export type SolutionDraft = {
    problem: Problem;
    actors: Actor[];
};

export type Solution = SolutionDraft & {
    solvedAtStep: number;
}
