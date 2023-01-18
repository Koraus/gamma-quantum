import { v3 } from "../utils/v";
import { ParticleWithMomentum } from "./terms";
import { tuple } from "../utils/tuple";

export function groupReactionVariantsBySymmetries<T extends {
    reagents: ParticleWithMomentum[];
    products: ParticleWithMomentum[];
}>(variants: T[]) {
    const mirrorTransforms = tuple(
        ([q, r, s]: v3) => [-q, -s, -r] as v3,
        ([q, r, s]: v3) => [s, r, q] as v3,
        ([q, r, s]: v3) => [-s, -r, -q] as v3,
        ([q, r, s]: v3) => [r, q, s] as v3,
        ([q, r, s]: v3) => [-r, -q, -s] as v3,
        ([q, r, s]: v3) => [q, s, r] as v3
    );

    const areInvariant = (
        variant1: ParticleWithMomentum[],
        variant2: ParticleWithMomentum[]
    ) => {
        const pt = (p: ParticleWithMomentum) => JSON.stringify({ mass: p.mass, velocity: p.velocity });
        return JSON.stringify(variant1.map(pt).sort())
            === JSON.stringify(variant2.map(pt).sort());
    };

    const groups = variants.map(variant => {
        const twins = mirrorTransforms.flatMap(m => {
            const mirroredVariant = {
                reagents: variant.reagents.map(p => ({ ...p, velocity: m(p.velocity) })),
                resolvedProducts: variant.products.map(p => ({ ...p, velocity: m(p.velocity) })),
            };
            return variants.filter(var2 => {
                if (var2 === variant) { return false; }
                return areInvariant(mirroredVariant.reagents, var2.reagents)
                    && areInvariant(mirroredVariant.resolvedProducts, var2.products);
            });
        });
        return new Set([variant, ...twins]);
    });

    while (true) {
        let changed = false;
        for (let i = groups.length - 1; i >= 0; i--) {
            for (let j = groups.length - 1; j > i; j--) {
                const gi = groups[i];
                const gj = groups[j];

                const g = new Set([...gi, ...gj]);
                if (g.size < (gi.size + gj.size)) {
                    groups[i] = g;
                    groups.splice(j, 1);
                    changed = true;
                }
            }
        }

        if (!changed) { break; }
    }

    return groups.map(g => [...g]);
}
