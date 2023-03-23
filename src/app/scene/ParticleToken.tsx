import { ParticleState } from "../../puzzle/world";
import { ParticleKind } from "../../puzzle/terms/ParticleKind";
import { directionOf } from "../../reactionSandbox/ParticleText";
import * as hax from "../../utils/hax";
import { SubparticleMesh } from "./SubparticleMesh";



export const getParticleColors = (p: ParticleKind) =>
    p.content === "gamma"
        ? ["white"]
        : [
            ...new Array(p.content.red).fill("#ff4000"),
            ...new Array(p.content.green).fill("#50ff00"),
            ...new Array(p.content.blue).fill("#9000ff"),
        ];

export function ParticleToken({
    particle: p,
}: {
    particle: ParticleState;
}) {
    const cs = getParticleColors(p);
    const subparticles = (() => {
        switch (cs.length) {
            case 1: return <>
                <SubparticleMesh position={[0, 0, 0]} color={cs[0]} />
            </>;
            case 2: return <>
                <SubparticleMesh position={[0.07, 0, 0]} color={cs[0]} />
                <SubparticleMesh position={[-0.07, 0, 0]} color={cs[1]} />
            </>;
            case 3: return <>
                <SubparticleMesh position={[0.07, 0, 0]} color={cs[0]} />
                <SubparticleMesh position={[-0.02, 0, 0.05]} color={cs[1]} />
                <SubparticleMesh position={[-0.02, 0, -0.05]} color={cs[3]} />
            </>;
            case 4: return <>
                <SubparticleMesh position={[0.07, 0, 0]} color={cs[0]} />
                <SubparticleMesh position={[-0.07, 0, 0]} color={cs[1]} />
                <SubparticleMesh position={[0, 0, 0.07]} color={cs[2]} />
                <SubparticleMesh position={[0, 0, -0.07]} color={cs[3]} />
            </>;
            default: throw "not supproted";
        }
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
