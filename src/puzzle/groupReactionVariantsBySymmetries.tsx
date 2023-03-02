import { v3 } from "../utils/v";
import { tuple } from "../utils/tuple";
import { Particle, particleMass } from "./Particle";

export const mirrorTransforms = tuple(
    ([q, r, s]: v3) => [-q, -s, -r] as v3,
    ([q, r, s]: v3) => [s, r, q] as v3,
    ([q, r, s]: v3) => [-s, -r, -q] as v3,
    ([q, r, s]: v3) => [r, q, s] as v3,
    ([q, r, s]: v3) => [-r, -q, -s] as v3,
    ([q, r, s]: v3) => [q, s, r] as v3,
);

const getParticleKey = (p: Particle) =>
    JSON.stringify({
        mass: particleMass(p),
        velocity: p.velocity,
    });

const getVariantKey = (v: {
    reagents: Particle[];
    products: Particle[];
}) => JSON.stringify({
    reagents: v.reagents.map(getParticleKey).sort(),
    products: v.products.map(getParticleKey).sort(),
});

export function groupReactionVariantsBySymmetries<T extends {
    reagents: Particle[];
    products: Particle[];
}>(variants: T[]) {
    const groups = {} as Record<string, Set<T>>;
    const keysProcessed = new Set<string>();

    for (const var1 of variants) {
        const key1 = getVariantKey(var1);
        const g1 = (groups[key1] ?? (groups[key1] = new Set()));
        g1.add(var1);

        if (keysProcessed.has(key1)) { continue; }
        keysProcessed.add(key1);

        for (const var2 of mirrorTransforms.map(m => ({
            reagents: var1.reagents
                .map(p => ({ ...p, velocity: m(p.velocity) })),
            products: var1.products
                .map(p => ({ ...p, velocity: m(p.velocity) })),
        }))) {
            const key2 = getVariantKey(var2);
            const g2 = groups[key2];

            if (g1 === g2) { continue; }
            if (!g2) { groups[key2] = g1; continue; }

            for (const v of g2) { g1.add(v); }
            for (const k in groups) {
                if (groups[k] === g2) { groups[k] = g1; }
            }
        }
    }

    return [...new Set(Object.values(groups))].map(g => [...g]);
}
