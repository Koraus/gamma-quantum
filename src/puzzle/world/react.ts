import { v2, v3 } from "../../utils/v";
import { directionVector, halfDirection2Vector } from "../direction";
import { eqParticleKind, keyifyParticleKind } from "../terms/ParticleKind";
import { particleMomentum } from "./Particle";
import * as hg from "../../utils/hg";
import { applyReactionsInPlace } from "../reactions";
import update from "immutability-helper";
import { pipe } from "fp-ts/lib/function";
import { World } from "./World";
import { trustedEntries } from "../../utils/trustedRecord";
import { parsePosition } from "../terms/Position";


export function react(world: World) {
    const reactedWorld = {
        ...world,
        consumed: { ...world.consumed },
        particles: [...world.particles],
    };


    applyReactionsInPlace(reactedWorld.particles);

    const actors = [
        ...trustedEntries(world.actors),
        ...trustedEntries(world.problem.actors),
    ];
    for (const [positionKey, a] of actors) {
        const position = parsePosition(positionKey);
        if (a.kind === "spawner") {
            if (reactedWorld.step % 12 === 1) {
                reactedWorld.particles.push({
                    ...a.output,
                    position: v3.from(...hg.axialToCube(position)),
                    velocity: [...directionVector[a.direction]],
                    isRemoved: false,
                });
            }
        }
        if (a.kind === "consumer") {
            for (let i = reactedWorld.particles.length - 1; i >= 0; i--) {
                const p = reactedWorld.particles[i];
                if (!p || p.isRemoved) { continue; }
                if (!v3.eq(hg.axialToCube(position), p.position)) {
                    continue;
                }

                if (eqParticleKind(p, a.input)) {
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
                if (!v3.eq(hg.axialToCube(position), p.position)) {
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
