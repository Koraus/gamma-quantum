import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { DirectionId } from "../puzzle/terms";
import { Particle, particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import { solveConservation } from "../puzzle/solveConservation";

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

export function* resolveReaction({
    reagents, products, helperDiraction,
}: {
    reagents: ParticleWithMomentum[];
    products: Particle[];
    helperDiraction: v3;
}) {
    const reagentsMomentum = reagents
        .map(particleMomentum)
        .reduce(v3.add, v3.zero());

    const reactionMomentumDirections = ((v) => {
        const [x, y] = hg.axialToFlatCart(v);
        const { PI } = Math;
        const a = Math.atan2(y, x) - PI / 2;
        const a1 = (a + PI * 2) % (2 * PI); // [0..2PI)
        const d = a1 / (PI * 2) * 6;

        const isReagentsMomentumAmbiguous = ((v) =>
            (v[0] === v[1]) || (v[0] === v[2]) || (v[1] === v[2])
        )(v);

        return (isReagentsMomentumAmbiguous
            ? [Math.floor(d), Math.ceil(d) % 6]
            : [Math.round(d) % 6]
        ) as DirectionId[];
    })(reagentsMomentum);

    const isReagentsMomentumAmbiguous = reactionMomentumDirections.length > 1;

    const reagentsEnergy = reagents
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    if (products.length === 1) {


        // check the options
        // v = 1, d = reactionMomentumDirection
        // v = 1, d = ~reactionMomentumDirection
        // v = 0
        // for each option, 
        // try to compensate momentum and enegry using gamma-quants
        for (const reactionMomentumDirection of reactionMomentumDirections) {
            for (const resolvedProduct of ([
                { velocity: 0, direction: 0 },
                { velocity: 1, direction: 0 },
                { velocity: 1, direction: 1 },
                { velocity: 1, direction: 2 },
                { velocity: 1, direction: 3 },
                { velocity: 1, direction: 4 },
                { velocity: 1, direction: 5 },
            ] as const).map(d => ({ ...d, ...products[0] }))) {
                const productsMomentum = [resolvedProduct]
                    .map(particleMomentum)
                    .reduce(v3.add, v3.zero());
                const productsEnergy = [resolvedProduct]
                    .map(particleEnegry)
                    .reduce((acc, v) => acc + v, 0);

                const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
                const deltaEnergy = productsEnergy - reagentsEnergy;

                for (const ds of solveConservation({
                    extraMomentum: v3.negate(deltaMomentum),
                    extraEnergy: -deltaEnergy,
                })) {
                    yield {
                        reagents,
                        reagentsMomentum,
                        reactionMomentumDirection,
                        isReagentsMomentumAmbiguous,
                        reagentsEnergy,

                        products,
                        resolvedProducts: [
                            resolvedProduct,
                            ...ds.map(d => ({
                                color: "white",
                                mass: 0,
                                velocity: 1 as const,
                                direction: directionOf(d)[0]
                            }))
                        ],
                    };
                }
            }
        }


        return;
    }

    throw "not implemented";
}
