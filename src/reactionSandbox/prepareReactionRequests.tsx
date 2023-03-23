import { groupReactionVariantsBySymmetries } from "../puzzle/reactions/groupReactionVariantsBySymmetries";
import * as hax from "../utils/hax";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle, particleMass } from "../puzzle/world/Particle";
import { tuple } from "../utils/tuple";
import { v2 } from "../utils/v";

export const velocityVariants = [
    v2.zero(),
    ...hax.direction.flat60.itCwFromSouth,
];

function* enumerateReagentRequests(
    reagents: (ParticleKind | Particle)[],
): Generator<Particle[]> {
    if (reagents.length === 0) {
        yield [];
        return;
    }
    const [head, ...tail] = reagents;
    if ("velocity" in head) {
        for (const x of enumerateReagentRequests(tail)) {
            yield [head, ...x];
        }
    } else {
        for (const v of velocityVariants) {
            if (hax.len(v) === 0 && particleMass(head) === 0) {
                continue;
            }
            for (const x of enumerateReagentRequests(tail)) {
                yield [
                    { velocity: tuple(...v), ...head },
                    ...x,
                ];
            }
        }
    }
}

export const prepareReactionRequests = (
    reagents: (ParticleKind | Particle)[],
) => groupReactionVariantsBySymmetries(
    enumerateReagentRequests(reagents)[Symbol.iterator]()
        .map(reagents => ({ reagents, products: [] })),
).map(vars => vars[0].reagents);
