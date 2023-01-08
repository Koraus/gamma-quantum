import { v3 } from "../utils/v";
import { IntRange_0Inc_5Inc, Particle, Solution } from "./terms";
import * as hg from "../utils/hg";
import { tuple } from "../utils/tuple";

export type ParticleState = Particle & {
    position: v3,
    direction: IntRange_0Inc_5Inc,
}

const directionVector = [
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 0),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 1),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 2),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 3),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 4),
    hg.cubeRotate60CvTimes(hg.cubeFlatNorth(), 5),
] as Record<IntRange_0Inc_5Inc, v3>;

export function initialWorld(): Parameters<typeof stepInPlace>[1] {
    return {
        step: 0,
        energy: 0,
        particles: [{
            position: hg.axialToCube([0, 0]),
            direction: 2,
            content: "red",
        }, {
            position: hg.axialToCube([-2, 2]),
            direction: 3,
            content: "green",
        }, {
            position: hg.axialToCube([1, 0]),
            direction: 3,
            content: "red",
        }, {
            position: hg.axialToCube([0, 3]),
            direction: 0,
            content: "green",
        }, {
            position: hg.axialToCube([3, 2]),
            direction: 5,
            content: ["red", "blue"],
        }, {
            position: hg.axialToCube([2, -5]),
            direction: 5,
            content: ["red", "green", "blue"],
        }],
    };
}

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

export function stepInPlace(
    soultion: Solution,
    world: {
        step: number;
        energy: number;
        particles: ParticleState[];
    }
) {
    for (const p of world.particles) {
        p.position = v3.add(p.position, directionVector[p.direction]);
    }

    const newParticles = [] as ParticleState[];

    for (const reaction of reactions) {
        while ((() => {
            for (const p1 of world.particles) {
                const r1 = reaction(p1);
                if (!r1) { continue; }
                if (typeof r1 === "function") {
                    for (const p2 of world.particles) {
                        if (p1 === p2) { continue; }
                        if (!v3.eqStrict(p1.position, p2.position)) { continue; }

                        const r2 = r1(p2);
                        if (!r2) { continue; }
                        if (typeof r2 === "function") {
                            for (const p3 of world.particles) {
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

                                world.particles.splice(world.particles.indexOf(p1), 1);
                                world.particles.splice(world.particles.indexOf(p2), 1);
                                newParticles.push(...r3);

                                return true;
                            }



                            continue;
                        }

                        world.particles.splice(world.particles.indexOf(p1), 1);
                        world.particles.splice(world.particles.indexOf(p2), 1);
                        newParticles.push(...r2);

                        return true;
                    }
                    continue;
                }

                world.particles.splice(world.particles.indexOf(p1), 1);
                newParticles.push(...r1);

                return true;
            }
            return false;
        })()) { /* */ }
    }



    world.particles.push(...newParticles);



    // for (const a of soultion.actors) {
    //     if (a.kind === "spawner") {
    //         world.energy -= 1;
    //         world.particles.push({
    //             ...a.output,
    //             position: v3.from(...a.position),
    //             direction: a.direction,
    //         });
    //     }
    // }

    world.step++;
}
