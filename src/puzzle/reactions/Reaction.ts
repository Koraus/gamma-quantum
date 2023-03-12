import { Particle, particleMass } from "../world/Particle";
import { Stringify } from "../../utils/Stringify";
import { trustedKeys } from "../../utils/trustedRecord";
import { ParticleKind } from "../terms/ParticleKind";

export type RequestedReaction = {
    reagents: Particle[];
    products: ParticleKind[];
};

export type ResolvedReaction = {
    reagents: Particle[];
    products: Particle[];
};

function keyifyReactionSide(ps: Particle[]) {
    type ReactionParticle = {
        mass: number; // zero or positive integer
        velocity: [number, number]; // [integer, integer]
    };
    type ReactionParticleKey = Stringify<ReactionParticle>;
    type ReactionSide = Partial<Record<
        ReactionParticleKey, number // non-zero positiove integer
    >>;

    const kps1 = ps.reduce((acc, p) => {
        const pk = JSON.stringify({
            mass: particleMass(p),
            velocity: p.velocity,
        }) as ReactionParticleKey;
        acc[pk] = (acc[pk] ?? 0) + 1;
        return acc;
    }, {} as ReactionSide);

    const kps2 = trustedKeys(kps1)
        .sort()
        .reduce(
            (acc, k) => (acc[k] = kps1[k], acc),
            {} as ReactionSide);

    return kps2;
}

export const keyifyResolvedReaction =
    ({ reagents, products }: ResolvedReaction) =>
        JSON.stringify({
            reagents: keyifyReactionSide(reagents),
            products: keyifyReactionSide(products),
        });
