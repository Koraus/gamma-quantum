import { useState } from "react";
import { useWorld } from "./useWorld";
import memoize from "memoizee";
import { World } from "./puzzle/step";
import { particlesEnergy, particlesMomentum } from "./puzzle/Particle";
import { directionSymbolFor } from "./reactionSandbox/ParticleText";

const worldStats = memoize((world: World) => {
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


export function WorldInfoPanel({
    ...props
}: JSX.IntrinsicElements["div"]) {
    const world = useWorld();
    const [isParticlesCollapsed, setIsParticlesCollapsed] = useState(true);

    const consumedText = Object.entries(world.consumed).map(([k, v], i) => {
        return <div key={i}><>= {v} x {k}</></div>;
    });

    const {
        liveParticles,
        particleTotalEnegry,
        particleTotalMomentum,
        ...stats
    } = worldStats(world);

    return <div {...props}>
        <div>step: {JSON.stringify(world.step)}</div>
        <div>energy: {JSON.stringify(world.energy)}</div>
        <div>momentum: 
            {directionSymbolFor(world.momentum)}
            {JSON.stringify(world.momentum)}
        </div>
        <div>consumed: {consumedText}</div>
        <div>particles: {liveParticles.length}
            {liveParticles.length > 0
                && <button
                    onClick={() =>
                        setIsParticlesCollapsed(!isParticlesCollapsed)}
                >{isParticlesCollapsed ? ">" : "⌄"}</button>}
            {!isParticlesCollapsed
                && liveParticles
                    .map(p => <div key={p.i}>
                        = #{p.i}: {JSON.stringify(p)}
                    </div>)}
        </div>
        <div>particle total energy: {particleTotalEnegry}</div>
        <div>
            particle total momentum:
            {directionSymbolFor(particleTotalMomentum)}
            {JSON.stringify(particleTotalMomentum)}</div>
        <div> stats: {JSON.stringify(stats)}</div>
    </div>;
}
