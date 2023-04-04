import { SpawnerActor } from "../../puzzle/terms/Actor";
import { ThreeElements } from "@react-three/fiber";
import { enumerateSubparticles } from "../../puzzle/reactions/enumerateProductCombinations";
import { subparticleColor } from "./subparticleColor";
import { GradientTexture } from "@react-three/drei";
import { DoubleSide } from "three";

export function SpawnerToken({
    actor, ...props
}: {
    actor: SpawnerActor;
} & ThreeElements["group"]) {
    const color = "#6fc0f7";
    const r = 1 / Math.sqrt(3);

    return <group {...props}>
        <group
            rotation={[0, -Math.PI / 3 * actor.direction, 0]}
            position={[0, 0, 0]}
        >
            <mesh
                rotation={[0, -Math.PI / 6, 0]}
                position={[0, 3, 0]}
                renderOrder={-2}
            >
                <cylinderGeometry args={[r * 1.3, r, 6, 6, 1, true]} />
                <meshBasicMaterial
                    side={DoubleSide}
                    color={color}
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                >
                    <GradientTexture
                        attach={"alphaMap"}
                        stops={[0, 1]}
                        colors={["black", "white", "white"]}
                    />
                </meshBasicMaterial>
            </mesh>
            <mesh
                rotation={[0, -Math.PI / 6, 0]}
                position={[0, 0.05, 0]}
                renderOrder={-1}
            >
                <cylinderGeometry args={[0, r * 0.8, 0.1, 6, 1, true]} />
                <meshBasicMaterial
                    side={DoubleSide}
                    color={color}
                    transparent
                    opacity={1}
                    depthWrite={false}
                >
                    <GradientTexture
                        attach={"alphaMap"}
                        stops={[0, 1]}
                        colors={["black", "white", "white"]}
                    />
                </meshBasicMaterial>
            </mesh>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.9 * r, r, 6]} />
                <meshBasicMaterial
                    color={color}
                />
            </mesh>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.9 * r, r, 6]} />
                <meshBasicMaterial
                    color={color}
                />
            </mesh>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.8 * r, 0.85 * r, 6]} />
                <meshBasicMaterial
                    color={color}
                />
            </mesh>
            <mesh
                position={[0, 0.001, r * 0.95]}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                scale={[1, 0.7, 1]}
            >
                <circleGeometry args={[r * 0.3, 3]} />
                <meshBasicMaterial
                    color={color}
                />
            </mesh>
            {enumerateSubparticles(actor.output).map((sp, i) => {
                const { cos, sin, PI } = Math;
                const a = i * Math.PI / 3;
                return <mesh
                    key={i}
                    rotation={[-PI / 2, 0, 0]}
                    position={[0.25 * r * sin(a), 0.001, -0.25 * r * cos(a)]}
                >
                    <ringGeometry args={[0.15 * r, 0.2 * r]} />
                    <meshBasicMaterial color={subparticleColor[sp]} />
                </mesh>;
            }).toArray()}
        </group>
    </group>;
}
