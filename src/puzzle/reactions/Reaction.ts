import { Particle, particleMass } from "../world/Particle";
import { Stringify } from "../../utils/Stringify";

export type ResolvedReaction = {
    reagents: Particle[];
    products: Particle[];
};

type ReactionParticle = {
    mass: number; // zero or positive integer
    velocity: [number, number]; // [integer, integer]
};
type ReactionParticleKey = Stringify<ReactionParticle>;

const keyifyReactionParticle = (p: Particle) => (
    "{\"mass\":"
    + particleMass(p)
    + ",\"velocity\":["
    + p.velocity[0]
    + ","
    + p.velocity[1]
    + "]}"
) as ReactionParticleKey;

export const keyifyResolvedReactionSide =
    (particles: Particle[]) =>
        JSON.stringify(particles.map(keyifyReactionParticle).sort());

export const keyifyResolvedReaction =
    ({ reagents, products }: ResolvedReaction) =>
        JSON.stringify({
            reagents: reagents.map(keyifyReactionParticle).sort(),
            products: products.map(keyifyReactionParticle).sort(),
        });
