import { ParticleState } from "./puzzle/stepInPlace";
import { directionOf } from "./reactionSandbox/ParticleText";



export function ParticleToken({
    particle: p,
}: {
    particle: ParticleState;
}) {
    const colors = (() => {
        if (Array.isArray(p.content)) { return p.content; }
        return [p.content];
    })().map(c => c === "gamma" ? "white" : c);



    return <group>
        <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.1]} />
            <meshPhongMaterial
                color={"white"}
                transparent
                opacity={0.2} />
        </mesh>
        {(() => {
            switch (colors.length) {
                case 1: return <>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                </>;
                case 2: return <>
                    <mesh position={[0.07, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                    <mesh position={[-0.07, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[1]} />
                    </mesh>
                </>;
                case 3: return <>
                    <mesh position={[0.07, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                    <mesh position={[-0.02, 0.05, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                    <mesh position={[-0.02, -0.05, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[1]} />
                    </mesh>
                </>;
                case 4: return <>
                    <mesh position={[0.07, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                    <mesh position={[-0.07, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[1]} />
                    </mesh>
                    <mesh position={[0, 0.07, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[0]} />
                    </mesh>
                    <mesh position={[0, -0.07, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshPhongMaterial color={colors[1]} />
                    </mesh>
                </>;
                default: throw "not supproted";
            }
        })()}
        <group
            rotation={[0, -Math.PI / 3 * directionOf(p.velocity)[0], 0]}
        >
            <mesh
                position={[0, 0, 0.55]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                <meshPhongMaterial
                    color={"white"}
                    transparent
                    opacity={0.2} />
            </mesh>
        </group>
    </group>;
}
