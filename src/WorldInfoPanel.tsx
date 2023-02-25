import { useState } from "react";
import { World } from "./puzzle/step";


export function WorldInfoPanel({
    world, ...props
}: {
    world: World;
} & JSX.IntrinsicElements["div"]) {
    const [isParticlesCollapsed, setIsParticlesCollapsed] = useState(true);

    const liveParticlesCount = world.particles.filter(p => !p.isRemoved).length;

    return <div {...props}>
        <div>step: {JSON.stringify(world.step)}</div>
        <div>energy: {JSON.stringify(world.energy)}</div>
        <div>consumed: {Object.entries(world.consumed).map(([k, v], i) => {
            return <div key={i}><>= {v} x {k}</></div>;
        })}</div>
        <div>particles: {liveParticlesCount}
            {liveParticlesCount > 0
                && <button
                    onClick={() => setIsParticlesCollapsed(!isParticlesCollapsed)}
                >{isParticlesCollapsed ? ">" : "⌄"}</button>}
            {!isParticlesCollapsed
                && world.particles.map((p, i) => {
                    if (p.isRemoved) { return null; }
                    return <div key={i}>
                        = #{i}: {JSON.stringify(p)}
                    </div>;
                })}
        </div>
    </div>;
}
