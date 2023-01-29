import { v2, v3 } from "../utils/v";
import * as hg from "../utils/hg";

export type Problem = undefined;

export type IntRange_0Inc_5Inc = 0 | 1 | 2 | 3 | 4 | 5;
export type DirectionId = IntRange_0Inc_5Inc;

export const directionVector = [
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 0),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 1),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 2),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 3),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 4),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 5),
] as const;

export type ParticleKind = {
    content:
        "gamma" 
        | "red"
        | "green"
        | "blue"
        | ("red" | "green" | "blue")[]
}

export type Particle = ParticleKind & {
    velocity: v3,
}

export const particleMass = (p: ParticleKind) => {
    if (p.content === "gamma") { return 0; };
    if (!Array.isArray(p.content)) { return 1; };
    if (p.content.length === 2) { return 1; }
    if (p.content.length === 3) { return 3; }
    if (p.content.length === 4) { return 4; }
    throw "unexpected particle content";
}

export const particleMomentum = (p: Particle) =>
    v3.scale(p.velocity, (particleMass(p) || 1) * hg.cubeLen(p.velocity));

export const particleEnegry = (p: Particle) =>
    particleMass(p) + hg.cubeLen(particleMomentum(p));



export type Actor = {
    position: v2,
    direction: IntRange_0Inc_5Inc,
} & ({
    kind: "mirror",
} | {
    kind: "reactor",
} | {
    kind: "spawner",
    output: ParticleKind,
});

export type Solution = {
    problem: Problem,
    actors: Actor[],
}