import { v2, v3 } from "../utils/v";
import { directionVector, halfDirection2Vector } from "./direction";
import { SolutionDraft } from "./Solution";
import { keyifyParticleKind, Particle, ParticleKindKey, particleMomentum, particlesMomentum } from "./Particle";
import * as hg from "../utils/hg";
import { applyReactionsInPlace } from "./reactions";
import update from "immutability-helper";
import * as u from "../utils/u";
import { pipe } from "fp-ts/lib/function";

export type ParticleState = Particle & {
    position: v3,
    isRemoved: boolean,
}

function move(world: World) {
    const trappedMomentum = particlesMomentum(
        world.particles
            .filter(p => !p.isRemoved
                && world.actors.some(a =>
                    a.kind === "trap"
                    && v3.eq(hg.axialToCube(a.position), p.position))));

    return update(world, {
        momentum: u.v3_add(trappedMomentum),
        particles: Object.fromEntries(world.particles.map((p, i) => [i, {
            position: u.v3_add(p.velocity),
            ...(world.actors.some(a =>
                a.kind === "trap"
                && v3.eq(hg.axialToCube(a.position), p.position),
            )
                ? { velocity: { $set: v3.zero() } }
                : {}),
        }])),
    });
}

function react(world: World) {
    const reactedWorld = {
        ...world,
        consumed: { ...world.consumed },
        particles: [...world.particles],
    };


    applyReactionsInPlace(reactedWorld.particles);

    for (const a of world.actors) {
        if (a.kind === "spawner") {
            if (reactedWorld.step % 12 === 1) {
                reactedWorld.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(a.position)),
                    velocity: [...directionVector[a.direction]],
                    isRemoved: false,
                });
            }
        }
        if (a.kind === "consumer") {
            for (let i = reactedWorld.particles.length - 1; i >= 0; i--) {
                const p = reactedWorld.particles[i];
                if (!p || p.isRemoved) { continue; }
                if (!v3.eq(hg.axialToCube(a.position), p.position)) {
                    continue;
                }

                if (keyifyParticleKind(p) === keyifyParticleKind(a.input)) {
                    reactedWorld.particles[i].isRemoved = true;
                    reactedWorld.consumed[keyifyParticleKind(p)] =
                        (reactedWorld.consumed[keyifyParticleKind(p)] ?? 0) + 1;
                }
            }
        }
        if (a.kind === "mirror") {
            for (let i = 0; i < reactedWorld.particles.length; i++) {
                const p = reactedWorld.particles[i];
                if (!p || p.isRemoved) { continue; }
                if (!v3.eq(hg.axialToCube(a.position), p.position)) {
                    continue;
                }

                const mirrorNormal = halfDirection2Vector[a.direction];

                const m1 = particleMomentum(p);

                const vc = hg.axialToFlatCart(p.velocity);
                const nc = hg.axialToFlatCart(mirrorNormal);
                const vc1 = v2.add(vc, v2.scale(nc, -0.5 * v2.dot(vc, nc)));
                p.velocity = pipe(
                    vc1,
                    hg.flatCartToAxial,
                    hg.axialToCube,
                    hg.cubeRound,
                );

                const dm = v3.sub(m1, particleMomentum(p));
                reactedWorld.momentum = v3.add(
                    reactedWorld.momentum,
                    dm,
                );
            }
        }
        if (a.kind === "trap") {
            // acts on movement step
        }
    }

    for (let i = reactedWorld.particles.length - 1; i >= 0; i--) {
        const p = reactedWorld.particles[i];
        if ((p.content === "gamma") && (world.particles[i])) {
            reactedWorld.momentum = v3.add(
                reactedWorld.momentum,
                particleMomentum(reactedWorld.particles[i]),
            );
            reactedWorld.particles[i] = update(p, {
                isRemoved: { $set: true },
            });
        }
    }

    return reactedWorld;
}

export type World = SolutionDraft & ({
    init: SolutionDraft;
    prev?: never;
    action: "init";
    step: 0;
} | {
    prev: World;
    action: "move" | "react";
    step: number;
}) & {
    energy: number;
    momentum: v3;
    consumed: Partial<Record<ParticleKindKey, number>>;
    particles: ParticleState[];
};


export const init = (solution: SolutionDraft): World => {
    // todo: ensure solution is valid:
    //  * all the actors have unique spots
    //  * spawners and consumers match the promblem list
    //--* +anything else?
    return ({
        ...solution,
        init: solution,
        action: "init",
        step: 0,
        energy: 0,
        momentum: v3.zero(),
        consumed: {},
        particles: [],
    });
};

const actions = { move, react };
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