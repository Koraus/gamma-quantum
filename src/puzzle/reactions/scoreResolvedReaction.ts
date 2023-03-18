import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import _ from "lodash";
import { particlesMomentum, particleMass, particlesDirectedMass } from "../world/Particle";
import { ResolvedReaction } from "./Reaction";

export function socreResolvedReaction({
    reagents, products,
}: ResolvedReaction) {
    const gs = _.groupBy(products, p => JSON.stringify(p.velocity));
    
    const massAtRest = gs[JSON.stringify(v2.zero())]
        ?.map(particleMass)
        .reduce((acc: number, v) => acc + v, 0) ?? 0;

    const momentaByDirectionSorted = Object.entries(gs)
        .filter(([k]) => k !== JSON.stringify(v2.zero()))
        .map(([, v]) => hax.len(particlesMomentum(v)))
        .sort((a, b) => b - a);

    const inertiaConservationScore = hax.len(v2.sub(
        particlesDirectedMass(reagents),
        particlesDirectedMass(products)));

    return [
        massAtRest,
        inertiaConservationScore,
        ...momentaByDirectionSorted,
    ]
        .map(x => x.toString().padStart(2, "0"))
        .join(",");
}
