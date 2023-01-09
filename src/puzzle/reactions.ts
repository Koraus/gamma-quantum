import { v3 } from "../utils/v";
import { ParticleState } from "./stepInPlace";
import { IntRange_0Inc_5Inc } from "./terms";

type Reaction =
    (p1: ParticleState) => (
        undefined
        | ParticleState[]
        | ((p2: ParticleState) => (
            undefined
            | ParticleState[]
            | ((p3: ParticleState) => (
                undefined
                | ParticleState[]
                | never
            ))
        ))
    );

const reactions: Reaction[] = [
    p1 => {
        const c1 = p1.content;
        if (c1 !== "red") { return; }
        return p2 => {
            if (p2.content !== "green") { return; }
            return [{
                position: p1.position,
                direction: p1.direction,
                content: [c1, p2.content],
            }, {
                position: p1.position,
                direction: ((3 + p1.direction) % 6) as IntRange_0Inc_5Inc,
                content: "gamma",
            }];
        }
    },
    p1 => {
        const c1 = p1.content;
        if (c1 !== "red") { return; }
        return p2 => {
            if (p2.content !== "blue") { return; }
            return [{
                position: p1.position,
                direction: p1.direction,
                content: [c1, p2.content],
            }, {
                position: p1.position,
                direction: ((3 + p1.direction) % 6) as IntRange_0Inc_5Inc,
                content: "gamma",
            }];
        }
    },
    p1 => {
        const c1 = p1.content;
        if (c1 !== "green") { return; }
        return p2 => {
            if (p2.content !== "blue") { return; }
            return [{
                position: p1.position,
                direction: p1.direction,
                content: [c1, p2.content],
            }, {
                position: p1.position,
                direction: ((3 + p1.direction) % 6) as IntRange_0Inc_5Inc,
                content: "gamma",
            }];
        }
    },
];

export function applyReactionsInPlace(particles: ParticleState[]) {
    const newParticles = [] as ParticleState[];

    for (const reaction of reactions) {
        while ((() => {
            for (const p1 of particles) {
                const r1 = reaction(p1);
                if (!r1) { continue; }
                if (typeof r1 === "function") {
                    for (const p2 of particles) {
                        if (p1 === p2) { continue; }
                        if (!v3.eqStrict(p1.position, p2.position)) { continue; }

                        const r2 = r1(p2);
                        if (!r2) { continue; }
                        if (typeof r2 === "function") {
                            for (const p3 of particles) {
                                if (p1 === p3) { continue; }
                                if (p2 === p3) { continue; }
                                if (!v3.eqStrict(p1.position, p3.position)) { continue; }
                                if (!v3.eqStrict(p2.position, p3.position)) { continue; }

                                const r3 = r2(p3);
                                if (!r3) { continue; }
                                if (typeof r3 === "function") {

                                    throw "not implemented";

                                    continue;
                                }

                                particles.splice(particles.indexOf(p1), 1);
                                particles.splice(particles.indexOf(p2), 1);
                                newParticles.push(...r3);

                                return true;
                            }



                            continue;
                        }

                        particles.splice(particles.indexOf(p1), 1);
                        particles.splice(particles.indexOf(p2), 1);
                        newParticles.push(...r2);

                        return true;
                    }
                    continue;
                }

                particles.splice(particles.indexOf(p1), 1);
                newParticles.push(...r1);

                return true;
            }
            return false;
        })()) { /* */ }
    }

    particles.push(...newParticles);
}