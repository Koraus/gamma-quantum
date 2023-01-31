import { v3 } from "../utils/v";
import { directionVector, IntRange_0Inc_5Inc, Particle, Solution } from "./terms";
import * as hg from "../utils/hg";
import { tuple } from "../utils/tuple";
import { applyReactionsInPlace } from "./reactions";
import _ from "lodash";

export type ParticleState = Particle & {
    position: v3,
    step: number,
}

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
        p.position = v3.add(p.position, p.velocity);
    }

    applyReactionsInPlace(world.particles);

    for (const a of soultion.actors) {
        if (a.kind === "spawner") {
            if (world.step % 6 === 0) {
                world.energy -= 1;
                world.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(a.position)),
                    velocity: directionVector[a.direction],
                    step: 0,
                });
            }
        }
    }

    world.step++;
    for (const p of world.particles) {
        p.step++;
    }
    for (let i = world.particles.length - 1; i >= 0; i--) {
        const p = world.particles[i];
        if ((p.content === "gamma") && (p.step > 2)) {
            world.particles.splice(i, 1);
            world.energy++;
        }
    }
}
