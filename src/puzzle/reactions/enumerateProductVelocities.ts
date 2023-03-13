import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { Particle, particleMass, particlesEnergy, particlesMomentum } from "../world/Particle"; import { solveConservation } from "./solveConservation";
import { tuple } from "../../utils/tuple";
import { RequestedReaction, ResolvedReaction, keyifyResolvedReaction } from "./Reaction";


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

export function enumerateProductVelocities({
    reagents, products,
}: RequestedReaction) {
    if (products.length > velocityVariantsArr.length) {
        throw new Error("not implemented");
    }

    const reagentsMomentum = particlesMomentum(reagents);
    const reagentsEnergy = particlesEnergy(reagents);

    const rs = velocityVariantsArr[products.length]
        .map((vels) => ({
            reagents,
            products: products
                .map((p, i) => ({ velocity: tuple(...vels[i]), ...p }))
                .filter(p => particleMass(p) > 0 || hax.len(p.velocity) > 0),
        }))
        .flatMap(resolvedReaction =>
            [...solveConservation({
                extraMomentum: v2.sub(
                    reagentsMomentum,
                    particlesMomentum(resolvedReaction.products)),
                extraEnergy: reagentsEnergy
                    - particlesEnergy(resolvedReaction.products),
            })]
                .map(ds => ({
                    reagents,
                    products: [
                        ...resolvedReaction.products,
                        ...ds.map(gamma),
                    ],
                })))
        .reduce(
            (acc, r) => (acc[keyifyResolvedReaction(r)] = r, acc),
            {} as Record<string, ResolvedReaction>);
    return Object.values(rs);
}
