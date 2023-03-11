import { v2 } from "../../utils/v";
import { particlesMomentum } from "./Particle";
import update from "immutability-helper";
import * as u from "../../utils/u";
import { ParticleState, World } from "./World";
import { keyifyPosition } from "../terms/Position";


export function move(world: World) {
    const isParticleTrapped = (p: ParticleState) => {
        if (p.isRemoved) { return false; }
        const pk = keyifyPosition(p.position);
        if (world.actors[pk]?.kind === "trap") { return true; }
        if (world.problem.actors[pk]?.kind === "trap") { return true; }
        return false;
    };

    const trappedMomentum = particlesMomentum(
        world.particles.filter(isParticleTrapped));

    return update(world, {
        momentum: u.v2_add(trappedMomentum),
        particles: Object.fromEntries(world.particles.map((p, i) => [i, {
            position: u.v2_add(p.velocity),
            ...(isParticleTrapped(p)
                ? { velocity: { $set: v2.zero() } }
                : {}),
        }])),
    });
}
