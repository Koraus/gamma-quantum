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

const velocityVariants = [
    [0, 0, 0] as v3,
    directionVector[0],
    directionVector[1],
    directionVector[2],
    directionVector[3],
    directionVector[4],
    directionVector[5],
];

export function* resolveReaction({
    reagents, products,
}: {
    reagents: ParticleWithMomentum[];
    products: Particle[];
}) {
    const reagentsMomentum = reagents.map(particleMomentum).reduce(v3.add, v3.zero());
    const reagentsEnergy = reagents.map(particleEnegry).reduce((acc, v) => acc + v, 0);

    if (products.length === 1) {
        for (const resolvedProduct of velocityVariants.map(d => ({ velocity: d, ...products[0] }))) {
            const productsMomentum = [resolvedProduct].map(particleMomentum).reduce(v3.add, v3.zero());
            const productsEnergy = [resolvedProduct].map(particleEnegry).reduce((acc, v) => acc + v, 0);

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
                    resolvedProduct,
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
