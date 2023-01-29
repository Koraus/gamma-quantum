import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { ParticleKind, Particle, particleEnegry, particleMass, particleMomentum, directionVector } from "./terms";
import { solveConservation } from "./solveConservation";
import { tuple } from "../utils/tuple";


export const velocityVariants = [v3.zero(), ...directionVector];
export const velocityVariants1 = velocityVariants.map(vel => tuple(vel));
export const velocityVariants2 = velocityVariants.flatMap(vel1 => velocityVariants.map(vel => tuple(vel1, vel)));
export const velocityVariants3 = velocityVariants2.flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants4 = velocityVariants3.flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants5 = velocityVariants4.flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariantsArr = [
    [], velocityVariants1, velocityVariants2, velocityVariants3,
    velocityVariants4, velocityVariants4
] as const;

export function generateReactionVariants({
    reagents, products,
}: {
    reagents: Particle[];
    products: ParticleKind[];
}) {
    if (products.length > velocityVariantsArr.length) { throw "not implemented"; }

    const reagentsMomentum = reagents.map(particleMomentum).reduce(v3.add, v3.zero());
    const reagentsEnergy = reagents.map(particleEnegry).reduce((acc, v) => acc + v, 0);

    return velocityVariantsArr[products.length]
        .map((vels) => ({
            reagents,
            products: products
                .map((p, i) => ({ velocity: vels[i], ...p }))
                .filter(p => particleMass(p) > 0 || hg.cubeLen(p.velocity) > 0),
        }))
        .flatMap(resolvedReaction => {
            const productsMomentum = resolvedReaction.products.map(particleMomentum).reduce(v3.add, v3.zero());
            const productsEnergy = resolvedReaction.products.map(particleEnegry).reduce((acc, v) => acc + v, 0);
    
            const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
            const deltaEnergy = productsEnergy - reagentsEnergy;
    
            return [...solveConservation({
                extraMomentum: v3.negate(deltaMomentum),
                extraEnergy: -deltaEnergy,
            })].map(ds => ({
                reagents,
                products: [
                    ...resolvedReaction.products,
                    ...ds.map(d => ({ content: "gamma", velocity: d } as Particle))
                ],
            }));
        });
}
