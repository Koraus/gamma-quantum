import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { Particle, _addParticleMomentum, _particleEnergy, _particleMass, particleMass, particlesEnergy, particlesMomentum } from "../world/Particle"; import { solveConservation } from "./solveConservation";
import { tuple } from "../../utils/tuple";
import { keyifyResolvedReaction } from "./Reaction";
import { ParticleKind } from "../terms/ParticleKind";


export const velocityVariants = [
    v2.zero(),
    ...hax.direction.flat60.itCwFromSouth,
];
export const velocityVariants1 = velocityVariants
    .map(vel => tuple(vel));
export const velocityVariants2 = velocityVariants
    .flatMap(vel1 => velocityVariants.map(vel => tuple(vel1, vel)));
export const velocityVariants3 = velocityVariants2
    .flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants4 = velocityVariants3
    .flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants5 = velocityVariants4
    .flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants6 = velocityVariants5
    .flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants7 = velocityVariants6
    .flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariantsArr = [
    [], velocityVariants1, velocityVariants2, velocityVariants3,
    velocityVariants4, velocityVariants5, velocityVariants6,
    velocityVariants7,
] as const;

const gamma = (d: Readonly<v2>) => ({
    content: "gamma",
    velocity: d,
} as Particle);

export function* enumerateProductVelocities({
    reagents, products,
}: {
    reagents: Particle[];
    products: ParticleKind[];
}) {
    if (products.length > velocityVariantsArr.length) {
        throw new Error("not implemented");
    }

    const reagentsMomentum = particlesMomentum(reagents);
    const reagentsEnergy = particlesEnergy(reagents);

    const yieldedReactions = {} as Record<string, true>;
    for (const vels of velocityVariantsArr[products.length]) {
        let extraEnergy = reagentsEnergy;
        const extraMomentum = [0, 0] as v2;
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const v = vels[i];
            if (_particleMass(p.content) === 0 && hax.len(v) === 0) {
                continue;
            }
            extraEnergy -= _particleEnergy(p.content, v);
            _addParticleMomentum(p.content, v, extraMomentum);
        }
        extraMomentum[0] = reagentsMomentum[0] - extraMomentum[0];
        extraMomentum[1] = reagentsMomentum[1] - extraMomentum[1];

        let resolvedProducts = undefined;
        for (const ds of solveConservation(extraMomentum, extraEnergy)) {
            resolvedProducts =
                resolvedProducts ?? products
                    .map((p, i) => ({ velocity: tuple(...vels[i]), ...p }))
                    .filter(p => particleMass(p) > 0
                        || hax.len(p.velocity) > 0);
            const r = {
                reagents,
                products: [
                    ...resolvedProducts,
                    ...ds.map(gamma),
                ],
            };
            const kr = keyifyResolvedReaction(r);
            if (kr in yieldedReactions) {
                continue;
            }
            yield r;
            yieldedReactions[kr] = true;
        }
    }
}
