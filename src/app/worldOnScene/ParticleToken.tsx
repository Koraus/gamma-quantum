import { ParticleState } from "../../puzzle/world";
import { directionOf } from "../../reactionSandbox/ParticleText";
import * as hax from "../../utils/hax";
import { SubparticleMesh } from "./SubparticleMesh";
import { subparticleColor } from "./subparticleColor";
import { enumerateSubparticles } from "../../puzzle/reactions/enumerateProductCombinations";


export function ParticleToken({
    particle: p,
}: {
    particle: ParticleState;
}) {
    const cs = enumerateSubparticles(p)
        .map(sp => subparticleColor[sp])
        .toArray();
    const subparticles = (() => {
        if (cs.length === 1) {
            return <SubparticleMesh position={[0, 0, 0]} color={cs[0]} />;
        }
        return <>{cs.map((c, i, { length }) => {
            const { sin, cos, PI } = Math;
            const r = 0.07;
            const a = i / length * PI * 2;
            return <SubparticleMesh
                key={i}
                position={[r * sin(a), 0, -r * cos(a)]}
                color={c} />;
        })}</>;
    })();
    return <group>
        <mesh  >
            <cylinderGeometry args={[0.4, 0.4, 0.1]} />
            <meshPhongMaterial
                color={"white"}
                transparent
                opacity={0.2} />
        </mesh>
        {subparticles}
        <group
            rotation={[0, -Math.PI / 3 * directionOf(p.velocity)[0], 0]}
        >
            {hax.len(p.velocity) > 0 &&
                <mesh
                    position={[0, 0, 0.55]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                    <meshPhongMaterial
                        color={"white"}
                        transparent
                        opacity={0.2} />
                </mesh>}
        </group>
    </group>;
}
