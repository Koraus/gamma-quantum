import { v3 } from "../utils/v";
import { areParticleKindsEqual, directionVector, getParticleKindKey, Particle, Solution } from "./terms";
import * as hg from "../utils/hg";
import { applyReactionsInPlace } from "./reactions";
import _ from "lodash";
import update from "immutability-helper";
import * as u from "../utils/u";

export type ParticleState = Particle & {
    position: v3,
    isRemoved: boolean,
}

function move(world: World) {
    return update(world, {
        particles: Object.fromEntries(world.particles.map((p, i) => [i, {
            position: u.v3_add(p.velocity),
        }]))
    });
}

function react(world: World) {
    const reactedWorld = {
        ...world,
        consumed: { ...world.consumed },
        particles: [...world.particles],
    }


    applyReactionsInPlace(reactedWorld.particles);

    for (const a of world.actors) {
        if (a.kind === "spawner") {
            if (reactedWorld.step % 12 === 1) {
                reactedWorld.energy -= 2;
                // register world mass, energy and momentum change
                reactedWorld.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(a.position)),
                    velocity: directionVector[a.direction],
                    isRemoved: false,
                });
            }
        }
        if (a.kind === "consumer") {
            for (let i = reactedWorld.particles.length - 1; i >= 0; i--) {
                const p = reactedWorld.particles[i];
                if (areParticleKindsEqual(p, a.input)) {
                    reactedWorld.particles.splice(i, 1);
                    reactedWorld.consumed[getParticleKindKey(p)] =
                        (reactedWorld.consumed[getParticleKindKey(p)] ?? 0) + 1;
                    // register world mass, energy and momentum change
                }
            }
        }
        if (a.kind === "mirror") {
            for (let i = 0; i < reactedWorld.particles.length; i++) {
                const p = reactedWorld.particles[i];
                if (!p || p.isRemoved) { continue; }
                if (!v3.eq(hg.axialToCube(a.position), p.position)) { continue; }

                // todo: simplify & optimize
                const mirrorNormal = directionVector[a.direction];
                const mirrorNormalNeg = v3.negate(mirrorNormal);
                if (v3.eq(p.velocity, mirrorNormal) || v3.eq(p.velocity, mirrorNormalNeg)) {
                    p.velocity = v3.negate(p.velocity);
                } else {
                    const v1 = hg.cubeRotate60Ccv(p.velocity);
                    if (v3.eq(v1, mirrorNormal) || v3.eq(v1, mirrorNormalNeg)) {
                        p.velocity = hg.cubeRotate60Cv(p.velocity);
                    } else {
                        p.velocity = v1;
                    }
                }
            }
        }
    }

    for (let i = reactedWorld.particles.length - 1; i >= 0; i--) {
        const p = reactedWorld.particles[i];
        if ((p.content === "gamma") && (world.particles[i])) {
            reactedWorld.particles[i] = update(p, {
                isRemoved: { $set: true, }
            });
            reactedWorld.energy++;
        }
    }

    return reactedWorld;
}

export type World = Solution & ({
    init: Solution;
    prev?: never;
    action: "init";
    step: 0;
} | {
    prev: World;
    action: "move" | "react";
    step: number;
}) & {
    energy: number;
    consumed: Record<string, number>;
    particles: ParticleState[];
};

export const init = (solution: Solution): World => ({
    ...solution,
    init: solution,
    action: "init",
    step: 0,
    energy: 0,
    consumed: {},
    particles: [],
});

const actions = { move, react }
const transitionTable = {
    init: "move",
    move: "react",
    react: "move",
} as const;

export function step(state: World) {
    const action = transitionTable[state["action"]];
    return update(actions[action](state), {
        prev: { $set: state },
        action: { $set: action },
        step: u.inc,
    });
}