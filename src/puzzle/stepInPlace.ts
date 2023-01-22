import { v3 } from "../utils/v";
import { IntRange_0Inc_5Inc, Particle, Solution } from "./terms";
import * as hg from "../utils/hg";
import { tuple } from "../utils/tuple";
import { applyReactionsInPlace } from "./reactions";

export type ParticleState = Particle & {
    position: v3,
    direction: IntRange_0Inc_5Inc,
}

export const directionVector = [
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 0),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 1),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 2),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 3),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 4),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 5),
] as const;

export function initialWorld(): Parameters<typeof stepInPlace>[1] {
    return {
        step: 0,
        energy: 0,
        particles: [],
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

    applyReactionsInPlace(world.particles);

    for (const a of soultion.actors) {
        if (a.kind === "spawner") {
            if (world.step % 6 === 0) {
                world.energy -= 1;
                world.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(a.position)),
                    direction: a.direction,
                });
            }
        }
    }

    world.step++;
}
