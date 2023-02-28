import { v2, v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { Problem } from "./Problem";
import { ParticleKind } from "./Particle";

export type IntRange_0Inc_5Inc = 0 | 1 | 2 | 3 | 4 | 5;
export type DirectionId = IntRange_0Inc_5Inc;
export type IntRange_0Inc_11Inc = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type HalfDirectionId = IntRange_0Inc_11Inc;

export const directionVector = [
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 0),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 1),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 2),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 3),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 4),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 5),
] as const;

export const halfDirection2Vector = [
    v3.add(directionVector[0], directionVector[0]),
    v3.add(directionVector[0], directionVector[1]),
    v3.add(directionVector[1], directionVector[1]),
    v3.add(directionVector[1], directionVector[2]),
    v3.add(directionVector[2], directionVector[2]),
    v3.add(directionVector[2], directionVector[3]),
    v3.add(directionVector[3], directionVector[3]),
    v3.add(directionVector[3], directionVector[4]),
    v3.add(directionVector[4], directionVector[4]),
    v3.add(directionVector[4], directionVector[5]),
    v3.add(directionVector[5], directionVector[5]),
    v3.add(directionVector[5], directionVector[0]),
] as const;

export type SpawnerActor = {
    position: v2,
    kind: "spawner",
    direction: IntRange_0Inc_5Inc,
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

export type Solution = {
    problem: Problem,
    actors: Actor[],
}
