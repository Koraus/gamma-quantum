import { useState } from "react";
import { useWorld } from "./useWorld";
import { directionSymbolFor } from "./reactionSandbox/ParticleText";
import { solutionStats, worldStats } from "./puzzle/world";
import { isSolutionComplete } from "./puzzle/Solution";


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
        <div> resetStats: {JSON.stringify(stats)}</div>
        {isSolutionComplete(world)
            && <div>
                solution stats: {JSON.stringify(solutionStats(world))}
            </div>}
    </div >;
}
