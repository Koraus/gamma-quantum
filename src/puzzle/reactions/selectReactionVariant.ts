import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import _ from "lodash";
import { tuple } from "../../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";
import { particlesMomentum, particleMass, particlesDirectedMass } from "../world/Particle";
import { Particle } from "../world/Particle";

function momentaDiversityScore(particles: Particle[]) {
    const gs = _.groupBy(particles, p => JSON.stringify(p.velocity));
    const massAtRest = gs[JSON.stringify(v2.zero())]
        ?.map(particleMass)
        .reduce((acc: number, v) => acc + v, 0) ?? 0;
    const momentaByDirectionSorted = Object.entries(gs)
        .filter(([k]) => k !== JSON.stringify(v2.zero()))
        .map(([, v]) => hax.len(particlesMomentum(v)))
        .sort((a, b) => b - a);
    return [
        massAtRest,
        ...momentaByDirectionSorted,
    ];
}

const inertiaConservationScore = ({
    reagents,
    products,
}: {
    reagents: Particle[];
    products: Particle[];
}) => hax.len(v2.sub(
    particlesDirectedMass(reagents),
    particlesDirectedMass(products)));

const reactionScore = (reaction: {
    reagents: Particle[];
    products: Particle[];
}) => [
    ...momentaDiversityScore(reaction.products),
    inertiaConservationScore(reaction),
]
    .map(x => x.toString().padStart(2, "0"))
    .join(",");

export function selectReactionVariant({
    variants,
}: {
    variants: Array<{
        reagents: Particle[];
        products: Particle[];
    }>;
}) {
    const allGrouppedVariants =
        Object.entries(_.groupBy(variants, reactionScore))
            .map(([k, v]) => tuple(k, groupReactionVariantsBySymmetries(v)));

    allGrouppedVariants.sort((g1, g2) => g1[0].localeCompare(g2[0], "en"));

    const filteredGrouppedVariants = allGrouppedVariants
        .map(([k, v]) => tuple(k, v.filter(v => v.length === 1)))
        .filter(([, v]) => v.length === 1);

    const selectedVariant = filteredGrouppedVariants[0]?.[1].length === 1
        ? filteredGrouppedVariants[0][1][0][0]
        : undefined;

    const noVariants = filteredGrouppedVariants.length === 0;

    const isResolved = noVariants || !!selectedVariant;

    return {
        allGrouppedVariants,
        filteredGrouppedVariants,
        selectedVariant,
        noVariants,
        isResolved,
    };
}
