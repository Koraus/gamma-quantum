import { enumerateProductVelocities } from "./enumerateProductVelocities";
import { selectReactionVariant } from "./selectReactionVariant";
import { ParticleState } from "../world";
import { particlesEnergy, particlesMomentum } from "../world/Particle";
import _ from "lodash";
import { enumerateProductCombinations } from "./enumerateProductCombinations";
import { eqParticleKind } from "../terms/ParticleKind";
import { v2 } from "../../utils/v";
import update from "immutability-helper";

const resolveReactionInCell = (reagents: ParticleState[]) => {
    reagents = [...reagents];
    const reagentsEnergy = particlesEnergy(reagents);
    const reagentsMomentum = particlesMomentum(reagents);
    const {
        selectedVariant,
    } = selectReactionVariant([...enumerateProductCombinations(reagents)
        .flatMap(products => enumerateProductVelocities(
            reagentsMomentum,
            reagentsEnergy,
            products))
        .map(products => ({ reagents, products }))]);
    if (!selectedVariant) { return reagents; }

    return selectedVariant.products.map(p => {
        const i = reagents.findIndex(r =>
            eqParticleKind(r, p)
            && v2.eq(r.velocity, p.velocity));
        if (i >= 0) {
            const r = reagents[i];
            reagents.splice(i, 1);
            return r;
        }
        return {
            ...p,
            position: reagents[0].position,
            isRemoved: false,
        };
    });
};

export function applyReactionsInPlace(particles: ParticleState[]) {
    const newParticles = Object.values(_.groupBy(
        particles.filter(p => !p.isRemoved),
        p => JSON.stringify(p.position)),
    ).flatMap(resolveReactionInCell);

    for (const p of newParticles) {
        if (particles.includes(p)) { continue; }
        particles.push(p);
    }

    for (const p of particles) {
        if (newParticles.includes(p)) { continue; }
        particles[particles.indexOf(p)] = update(p, {
            isRemoved: { $set: true },
        });
    }
}