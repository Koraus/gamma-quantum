import { v2 } from "../utils/v";
import * as hax from "../utils/hax";
import _ from "lodash";
import { tuple } from "../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";
import { ParticleKind } from "./terms/ParticleKind";
import { particlesMomentum, particlesEnergy } from "./world/Particle";
import { Particle } from "./world/Particle";


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
    const reagentsMomentum = particlesMomentum(requestedReaction.reagents);
    const reagentsEnergy = particlesEnergy(requestedReaction.reagents);

    const allGrouppedVariants = Object.entries(_.groupBy(variants, vr => {
        const mainProducts = vr.products
            .slice(0, requestedReaction.products.length);

        const productsMomentum = particlesMomentum(mainProducts);
        const productsEnergy = particlesEnergy(mainProducts);

        const deltaMomentum = v2.sub(productsMomentum, reagentsMomentum);
        const deltaEnergy = productsEnergy - reagentsEnergy;

        return -100 * deltaEnergy + hax.len(deltaMomentum);
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
