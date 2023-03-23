import { enumerateProductVelocities } from "./enumerateProductVelocities";
import { selectReactionVariant } from "./selectReactionVariant";
import { ParticleState } from "../world";
import { particlesEnergy, particlesMomentum } from "../world/Particle";
import _ from "lodash";
import { enumerateProductCombinations } from "./enumerateProductCombinations";

export function applyReactionsInPlace(particles: ParticleState[]) {
    const newParticles = Object.values(_.groupBy(
        particles
            .filter(p => !p.isRemoved),
        p => JSON.stringify(p.position)),
    ).flatMap(reagents => {
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
        if (selectedVariant) {
            return selectedVariant.products
                .map(p => ({
                    ...p,
                    position: reagents[0].position,
                    isRemoved: false,
                }));
        }
        return reagents;
    });

    // todo diff newParticles vs particles,
    // - apply (add) the changed particles
    // - leave unchanged as is on their positions
    for (let i = 0; i < particles.length; i++) {
        particles[i].isRemoved = true;
    }
    particles.push(...newParticles);
}