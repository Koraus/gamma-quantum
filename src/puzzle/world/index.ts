import memoize from "memoizee";
import update from "immutability-helper";
import * as u from "../../utils/u";
import * as hg from "../../utils/hg";
import { Solution, SolutionDraft } from "../Solution";
import { init } from "./init";
import { react } from "./react";
import { move } from "./move";
import { World } from "./World";
import { _throw } from "../../utils/_throw";
import { particlesEnergy, particlesMomentum } from "../Particle";
import { trustedEntries } from "../../utils/trustedRecord";

export type { ParticleState, World } from "./World";

const actions = { move, react };
const transitionTable = {
    init: "move",
    move: "react",
    react: "move",
} as const;

export function step(state: World) {
    const action = transitionTable[state["action"]];
    return update(actions[action](state), {
        prev: { $set: state },
        action: { $set: action },
        step: u.inc,
    });
}

export const worldAtStep = memoize(
    (solution: SolutionDraft, x: number): World =>
        x === 0
            ? init(solution)
            : step(worldAtStep(solution, x - 1)),
    { max: 5000 });

export const isSolved = (world: World) =>
    trustedEntries(world.problem.demand)
        .every(([key, count]) => (world.consumed[key] ?? 0) >= count);

export function assertSolved(solution: Solution) {
    isSolved(worldAtStep(solution, solution.solvedAtStep))
        || _throw("Assertion failed: " +
            "World is not sovled at solution.solvedAtStep");
}

export const worldStats = memoize((world: World) => {
    const liveParticles = world.particles
        .map((p, i) => ({ ...p, i }))
        .filter(p => !p.isRemoved);
    const particleTotalEnegry = particlesEnergy(liveParticles);
    const particleTotalMomentum = particlesMomentum(liveParticles);
    return {
        liveParticles,
        particleTotalEnegry,
        particleTotalMomentum,
    };
}, { max: 1000 });

export const solutionStats = (solution: Solution) => {
    const world = worldAtStep(solution, solution.solvedAtStep);
    const stats = worldStats(world);

    return {
        solvedAtStep: solution.solvedAtStep,
        energy:
            world.energy
            + hg.cubeLen(world.momentum)
            + stats.particleTotalEnegry
            + hg.cubeLen(stats.particleTotalMomentum),
    };
};

export const solvedAtStep = (world: World) => {
    if (!isSolved(world)) { return undefined; }
    let solvedAtWorld = world;
    while (
        solvedAtWorld.prev
        && isSolved(solvedAtWorld.prev)
    ) {
        solvedAtWorld = solvedAtWorld.prev;
    }
    return solvedAtWorld.step;
};
