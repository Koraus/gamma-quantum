import { rv2, v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import _ from "lodash";
import { particleMass, particlesDirectedMass, particleMomentum, keyifyParticle, particlesMomentum } from "../world/Particle";
import { ResolvedReaction } from "./Reaction";
import { keyifyParticleKind } from "../terms/ParticleKind";


const hax_flatCartDir = (h: rv2) => {
    const [x, y] = hax.toFlatCart(h);
    return Math.atan2(y, x);
};

export function* scoreResolvedReaction({
    reagents, products,
}: ResolvedReaction) {
    // priorities are:
    // - agility: energy tends to be conserved by movement
    //    - not in mass
    //    - not in gammas (as they dissipate enegry out of world)
    // - reactivity: better recombine than not

    // the less mass is stationary -- bettter (more movement)
    yield products.reduce(
        (acc, p) => acc + (hax.len(p.velocity) === 0 ? particleMass(p) : 0),
        0);

    // count of particle kinds com mon for both sides of reaction
    // less in common -- better (higher reactivity)
    {
        const _krs = reagents.map(keyifyParticleKind);
        const common = products.filter(p => {
            const kp = keyifyParticleKind(p);
            const i = _krs.indexOf(kp);
            if (i < 0) { return false; }
            _krs.splice(i, 1);
            return true;
        });
        yield common.length;
    }

    // less gammas -- bettter (more energy trapped inside world)
    yield products.reduce((acc, p) => acc + (particleMass(p) === 0 ? 1 : 0), 0);

    // less mass -- better (more energy in movement)
    yield products.reduce((acc, p) => acc + particleMass(p), 0);

    // more momentum -- better (more energy in movement) (redundant?)
    yield -products.reduce((acc, p) => acc + hax.len(particleMomentum(p)), 0);

    // inertia by direction, sorted -- spreads mass in different directions
    const gs = _.groupBy(
        products.filter(p => particleMass(p) > 0),
        p => JSON.stringify(p.velocity));
    yield* Object.entries(gs)
        .filter(([k]) => k !== JSON.stringify(v2.zero()))
        .map(([, v]) => hax.len(particlesMomentum(v)))
        .sort((a, b) => b - a);

    // inertia
    // more mass continues to move in the same direction -- better
    yield Math.abs(
        hax_flatCartDir(particlesDirectedMass(reagents))
        - hax_flatCartDir(particlesDirectedMass(products)));

    // count of particles with velocities common for both sides of reaction
    // helps to resovle elastic collisions
    {
        const _krs = reagents.map(keyifyParticle);
        const common = products.filter(p => {
            const kp = keyifyParticle(p);
            const i = _krs.indexOf(kp);
            if (i < 0) { return false; }
            _krs.splice(i, 1);
            return true;
        });
        yield common.length;
    }
}
