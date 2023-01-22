import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { DirectionId } from "../puzzle/terms";
import { Particle, particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import { solveConservation } from "../puzzle/solveConservation";
import { directionVector } from "../puzzle/stepInPlace";
import { tuple } from "../utils/tuple";

export function directionOf(v: v3) {
    const [x, y] = hg.axialToFlatCart(v);
    const { PI } = Math;
    const a = Math.atan2(y, x) - PI / 2;
    const a1 = (a + PI * 2) % (2 * PI); // [0..2PI)
    const d = a1 / (PI * 2) * 6;

    const isAmbiguous = ((v) =>
        (v[0] === v[1]) || (v[0] === v[2]) || (v[1] === v[2])
    )(v);

    return (isAmbiguous
        ? [Math.floor(d), Math.ceil(d) % 6]
        : [Math.round(d) % 6]
    ) as DirectionId[];
}

export const velocityVariants = [v3.zero(), ...directionVector];
export const velocityVariants1 = velocityVariants.map(vel => tuple(vel));
export const velocityVariants2 = velocityVariants.flatMap(vel1 => velocityVariants.map(vel => tuple(vel1, vel)));
export const velocityVariants3 = velocityVariants2.flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariants4 = velocityVariants3.flatMap(vels => velocityVariants.map(vel => tuple(...vels, vel)));
export const velocityVariantsArr = [[], velocityVariants1, velocityVariants2, velocityVariants3, velocityVariants4] as const;

export function* resolveReaction({
    reagents, products,
}: {
    reagents: ParticleWithMomentum[];
    products: Particle[];
}) {
    const reagentsMomentum = reagents.map(particleMomentum).reduce(v3.add, v3.zero());
    const reagentsEnergy = reagents.map(particleEnegry).reduce((acc, v) => acc + v, 0);

    if (products.length === 0) {
        const productsMomentum = [].map(particleMomentum).reduce(v3.add, v3.zero());
        const productsEnergy = [].map(particleEnegry).reduce((acc, v) => acc + v, 0);

        const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
        const deltaEnergy = productsEnergy - reagentsEnergy;

        yield* [...solveConservation({
            extraMomentum: v3.negate(deltaMomentum),
            extraEnergy: -deltaEnergy,
        })].map(ds => ({
            reagents,
            reagentsMomentum,
            reagentsEnergy,

            reauestedProducts: products,
            products: [
                ...ds.map(d => ({ color: "white", mass: 0, velocity: d }))
            ],

            deltaMomentum,
            deltaEnergy,
        }));

        return;
    }

    if (products.length <= velocityVariantsArr.length) {
        const resolvedReactions = velocityVariantsArr[products.length].map((vels) => ({
            reagents,
            products: products
                .map((p, i) => ({ velocity: vels[i], ...p }))
                .filter(p => p.mass > 0 || hg.cubeLen(p.velocity) > 0),
        }));

        for (const resolvedReaction of resolvedReactions) {
            const productsMomentum = resolvedReaction.products.map(particleMomentum).reduce(v3.add, v3.zero());
            const productsEnergy = resolvedReaction.products.map(particleEnegry).reduce((acc, v) => acc + v, 0);

            const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
            const deltaEnergy = productsEnergy - reagentsEnergy;

            yield* [...solveConservation({
                extraMomentum: v3.negate(deltaMomentum),
                extraEnergy: -deltaEnergy,
            })].map(ds => ({
                reagents,
                reagentsMomentum,
                reagentsEnergy,

                reauestedProducts: products,
                products: [
                    ...resolvedReaction.products,
                    ...ds.map(d => ({ color: "white", mass: 0, velocity: d }))
                ],

                deltaMomentum,
                deltaEnergy,
            }));
        }


        return;
    }

    throw "not implemented";
}
