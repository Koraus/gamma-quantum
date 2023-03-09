import { v3 } from "../../utils/v";
import { particlesMomentum } from "./Particle";
import * as hg from "../../utils/hg";
import update from "immutability-helper";
import * as u from "../../utils/u";
import { World } from "./World";


export function move(world: World) {
    const trappedMomentum = particlesMomentum(
        world.particles
            .filter(p => !p.isRemoved
                && world.actors.some(a => a.kind === "trap"
                    && v3.eq(hg.axialToCube(a.position), p.position))));

    return update(world, {
        momentum: u.v3_add(trappedMomentum),
        particles: Object.fromEntries(world.particles.map((p, i) => [i, {
            position: u.v3_add(p.velocity),
            ...(world.actors.some(a => a.kind === "trap"
                && v3.eq(hg.axialToCube(a.position), p.position))
                ? { velocity: { $set: v3.zero() } }
                : {}),
        }])),
    });
}
