import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import _ from "lodash";
import { tuple } from "../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";
import { ParticleKind, particleMomentum, particleEnegry } from "./Particle";
import { Particle } from "./Particle";


export function selectReactionVariant({
    requestedReaction, variants,
}: {
    requestedReaction: {
        reagents: Particle[];
        products: ParticleKind[];
    };
    variants: Array<{
        reagents: Particle[];
        products: Particle[];
    }>;
}) {
    const reagentsMomentum = requestedReaction.reagents.map(particleMomentum).reduce(v3.add, v3.zero());
    const reagentsEnergy = requestedReaction.reagents.map(particleEnegry).reduce((acc, v) => acc + v, 0);

    const allGrouppedVariants = Object.entries(_.groupBy(variants, vr => {
        const mainProducts = vr.products.slice(0, requestedReaction.products.length);

        const productsMomentum = mainProducts.map(particleMomentum).reduce(v3.add, v3.zero());
        const productsEnergy = mainProducts.map(particleEnegry).reduce((acc, v) => acc + v, 0);

        const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
        const deltaEnergy = productsEnergy - reagentsEnergy;

        return -100 * deltaEnergy + hg.cubeLen(deltaMomentum);
    }))
        .map(([k, v]) => tuple(k, groupReactionVariantsBySymmetries(v)));

    allGrouppedVariants.sort((g1, g2) => +g1[0] - +g2[0]);

    const filteredGrouppedVariants = allGrouppedVariants
        .map(([k, v]) => tuple(k, v.filter(v => v.length === 1)))
        .filter(([, v]) => v.length > 0);

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
