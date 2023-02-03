import { v3 } from "../utils/v";
import { areParticleKindsEqual, directionVector, getParticleKindKey, IntRange_0Inc_5Inc, Particle, Solution } from "./terms";
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
        consumed: {},
        particles: [],
    };
}


export function stepInPlace(
    soultion: Solution,
    world: {
        step: number;
        energy: number;
        consumed: Record<string, number>;
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
                // register world mass, energy and momentum change
                world.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(a.position)),
                    velocity: directionVector[a.direction],
                    step: 0,
                });
            }
        }
        if (a.kind === "consumer") {
            for (let i = world.particles.length - 1; i >= 0; i--) {
                const p = world.particles[i];
                if (areParticleKindsEqual(p, a.input)) {
                    world.particles.splice(i, 1);
                    world.consumed[getParticleKindKey(p)] =
                        (world.consumed[getParticleKindKey(p)] ?? 0) + 1;
                    // register world mass, energy and momentum change
                }
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
