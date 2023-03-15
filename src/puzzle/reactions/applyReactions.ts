import { v2 } from "../../utils/v";
import { enumerateProductVelocities } from "./enumerateProductVelocities";
import { selectReactionVariant } from "./selectReactionVariant";
import { ParticleState } from "../world";
import update from "immutability-helper";
import { ParticleKind } from "../terms/ParticleKind";
import { particleCount } from "../world/Particle";

type Reaction =
    (p1: ParticleState) => (
        undefined
        | ParticleKind[]
        | ((p2: ParticleState) => (
            undefined
            | ParticleKind[]
            | ((p3: ParticleState) => (
                undefined
                | ParticleKind[]
                | never
            ))
        ))
    );

const reactions: Reaction[] = [
    p1 => {
        const c1 = p1.content;
        if (c1 === "gamma") { return; }
        return p2 => {
            const c2 = p2.content;
            if (c2 === "gamma") { return; }

            return [{
                content: {
                    red: c1.red + c2.red,
                    green: c1.green + c2.green,
                    blue: c1.blue + c2.blue,
                },
            }];
        };
    },
    p1 => {
        const c1 = p1.content;
        if (c1 === "gamma") { return; }
        if (particleCount(p1) !== 4) { return; }
        return p2 => {
            const c2 = p2.content;
            if (c2 !== "gamma") { return; }

            const r1 = { ...c1 };
            const r2 = { red: 0, green: 0, blue: 0 };
            let counter = 0;
            while (counter < 2 && r1.red > 0) { counter++; r1.red--; r2.red++; }
            while (counter < 2 && r1.green > 0) { counter++; r1.green--; r2.green++; }
            while (counter < 2 && r1.blue > 0) { counter++; r1.blue--; r2.blue++; }

            return [{ content: r1 }, { content: r2 }];
        };
    },
    p1 => {
        const c1 = p1.content;
        if (c1 === "gamma") { return; }
        if (particleCount(p1) !== 4) { return; }
        return p2 => {
            const c2 = p2.content;
            if (c2 !== "gamma") { return; }

            return p3 => {
                const c3 = p3.content;
                if (c3 !== "gamma") { return; }

                const r1 = { ...c1 };
                const r2 = { red: 0, green: 0, blue: 0 };
                let counter = 0;
                while (counter < 2 && r1.red > 0) { counter++; r1.red--; r2.red++; }
                while (counter < 2 && r1.green > 0) { counter++; r1.green--; r2.green++; }
                while (counter < 2 && r1.blue > 0) { counter++; r1.blue--; r2.blue++; }

                return [{ content: r1 }, { content: r2 }];
            };
        };
    },
];

export function applyReactionsInPlace(particles: ParticleState[]) {
    const newParticles = [] as ParticleState[];

    for (const reaction of reactions) {
        while ((() => {
            for (const p1 of particles) {
                if (p1.isRemoved) { continue; }
                const r1 = reaction(p1);
                if (!r1) { continue; }
                if (typeof r1 === "function") {
                    for (const p2 of particles) {
                        if (p2.isRemoved) { continue; }
                        if (p1 === p2) { continue; }
                        if (!v2.eqStrict(p1.position, p2.position)) { continue; }

                        const r2 = r1(p2);
                        if (!r2) { continue; }
                        if (typeof r2 === "function") {
                            for (const p3 of particles) {
                                if (p3.isRemoved) { continue; }
                                if (p1 === p3) { continue; }
                                if (p2 === p3) { continue; }
                                if (!v2.eqStrict(p1.position, p3.position)) { continue; }
                                if (!v2.eqStrict(p2.position, p3.position)) { continue; }

                                const r3 = r2(p3);
                                if (!r3) { continue; }
                                if (typeof r3 === "function") {

                                    throw "not implemented";

                                    continue;
                                }

                                const requestedReaction = {
                                    reagents: [p1, p2, p3],
                                    products: r3,
                                };
                                const variants = [...enumerateProductVelocities(requestedReaction)];
                                const {
                                    selectedVariant,
                                } = selectReactionVariant(variants);
                                if (selectedVariant) {
                                    particles[particles.indexOf(p1)] = update(p1, {
                                        isRemoved: { $set: true },
                                    });
                                    particles[particles.indexOf(p2)] = update(p2, {
                                        isRemoved: { $set: true },
                                    });
                                    newParticles.push(...selectedVariant.products.map(p => ({
                                        ...p,
                                        position: p1.position,
                                        step: 0,
                                        isRemoved: false,
                                    })));

                                    return true;
                                }
                            }


                            continue;
                        }


                        const requestedReaction = {
                            reagents: [p1, p2],
                            products: r2,
                        };
                        const variants = [...enumerateProductVelocities(requestedReaction)];
                        const {
                            selectedVariant,
                        } = selectReactionVariant(variants);
                        if (selectedVariant) {
                            particles[particles.indexOf(p1)] = update(p1, {
                                isRemoved: { $set: true },
                            });
                            particles[particles.indexOf(p2)] = update(p2, {
                                isRemoved: { $set: true },
                            });
                            newParticles.push(...selectedVariant.products.map(p => ({
                                ...p,
                                position: p1.position,
                                step: 0,
                                isRemoved: false,
                            })));

                            return true;
                        }

                    }
                    continue;
                }

                throw "not implemented";

                return true;
            }
            return false;
        })()) { /* */ }
    }

    particles.push(...newParticles);
}