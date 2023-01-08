import { v3 } from "../utils/v";
import { IntRange_0Inc_5Inc, Particle, Solution } from "./terms";
import * as hg from "../utils/hg";

export type ParticleState = Particle & {
    position: v3,
    direction: IntRange_0Inc_5Inc,
}

const directionVector = [
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 0),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 1),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 2),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 3),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 4),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 5),
] as Record<IntRange_0Inc_5Inc, v3>;

export function initialWorld(): Parameters<typeof stepInPlace>[1] {
    return {
        step: 0,
        energy: 0,
        particles: [{
            position: hg.axialToCube([0, 0]),
            direction: 2,
            content: "red",
        }, {
            position: hg.axialToCube([-2, 2]),
            direction: 3,
            content: "green",
        }, {
            position: hg.axialToCube([1, 0]),
            direction: 3,
            content: "red",
        }, {
            position: hg.axialToCube([0, 3]),
            direction: 0,
            content: "green",
        }, {
            position: hg.axialToCube([3, 2]),
            direction: 5,
            content: ["red", "blue"],
        }, {
            position: hg.axialToCube([2, -5]),
            direction: 5,
            content: ["red", "green", "blue"],
        }],
    };
}

export function stepInPlace(
    soultion: Solution,
    world: {
        step: number;
        energy: number;
        particles: ParticleState[];
    }
) {
    for (const p of world.particles) {
        p.position = v3.add(p.position, directionVector[p.direction]);
    }

    // group particles by position
    // perform reactions in groups

    // for (const a of soultion.actors) {
    //     if (a.kind === "spawner") {
    //         world.energy -= 1;
    //         world.particles.push({
    //             ...a.output,
    //             position: v3.from(...a.position),
    //             direction: a.direction,
    //         });
    //     }
    // }

    world.step++;
}
