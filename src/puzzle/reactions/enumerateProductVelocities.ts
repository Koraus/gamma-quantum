import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { Particle, _addParticleMomentum, _particleEnergy, particleMass } from "../world/Particle";
import { solveConservation } from "./solveConservation";
import { tuple } from "../../utils/tuple";
import { keyifyResolvedReactionSide } from "./Reaction";
import { ParticleKind, keyifyParticleKind } from "../terms/ParticleKind";
import memoize from "memoizee";


const gamma = (d: Readonly<v2>) => ({
    content: "gamma",
    velocity: d,
} as Particle);

export function* _enumerateProductVelocitiesBody(
    extraMomentum: readonly [number, number],
    extraEnergy: number,
    productsFree: ParticleKind[],
    productsFixed: Particle[],
): Generator<Particle[]> {

    if (productsFree.length === 0) {
        for (const ds of solveConservation(extraMomentum, extraEnergy)) {
            yield [
                ...productsFixed,
                ...ds.map(gamma),
            ];
        }
        return;
    }

    const [head, ...tail] = productsFree;
    let tailMomentum = 0;
    for (const p of productsFree) { tailMomentum += particleMass(p) || 1; }

    while (particleMass(head) !== 0) {
        const v = v2.r.zero;

        const extraEnergy1 = extraEnergy - _particleEnergy(head.content, v);
        if (0 > extraEnergy1) { break; }

        const extraMomentum1 = [0, 0] as v2;
        _addParticleMomentum(head.content, v, extraMomentum1);
        extraMomentum1[0] = extraMomentum[0] - extraMomentum1[0];
        extraMomentum1[1] = extraMomentum[1] - extraMomentum1[1];
        if (hax.len(extraMomentum1) - tailMomentum > extraEnergy1) { break; }

        yield* _enumerateProductVelocitiesBody(
            extraMomentum1,
            extraEnergy1,
            tail,
            [...productsFixed, { velocity: tuple(...v), ...head }],
        );

        break;
    }

    for (const v of hax.direction.flat60.itCwFromSouth) {
        const extraEnergy1 = extraEnergy - _particleEnergy(head.content, v);
        if (0 > extraEnergy1) { continue; }

        const extraMomentum1 = [0, 0] as v2;
        _addParticleMomentum(head.content, v, extraMomentum1);
        extraMomentum1[0] = extraMomentum[0] - extraMomentum1[0];
        extraMomentum1[1] = extraMomentum[1] - extraMomentum1[1];
        if (hax.len(extraMomentum1) - tailMomentum > extraEnergy1) { continue; }

        yield* _enumerateProductVelocitiesBody(
            extraMomentum1,
            extraEnergy1,
            tail,
            [...productsFixed, { velocity: tuple(...v), ...head }],
        );
    }

}

export function* _enumerateProductVelocities(
    reagentsMomentum: readonly [number, number],
    reagentsEnergy: number,
    products: ParticleKind[],
) {
    const yieldedReactions = {} as Record<string, true>;

    for (const r of _enumerateProductVelocitiesBody(
        reagentsMomentum,
        reagentsEnergy,
        products,
        [],
    )) {
        const kr = keyifyResolvedReactionSide(r);
        if (kr in yieldedReactions) {
            continue;
        }
        yield r;
        yieldedReactions[kr] = true;
    }
}

export const enumerateProductVelocities = memoize((
    reagentsMomentum: readonly [number, number],
    reagentsEnergy: number,
    products: ParticleKind[],
) => [..._enumerateProductVelocities(
    reagentsMomentum,
    reagentsEnergy,
    products,
)], {
    normalizer: ([
        reagentsMomentum,
        reagentsEnergy,
        products,
    ]: [
            reagentsMomentum: readonly [number, number],
            reagentsEnergy: number,
            products: ParticleKind[],
        ]) => JSON.stringify({
            reagentsMomentum,
            reagentsEnergy,
            products: products.map(keyifyParticleKind).sort(),
        }),
});
