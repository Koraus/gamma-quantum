
import { GradientTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import { ThreeElements } from "@react-three/fiber";


export function TrapToken({
    ...props
}: ThreeElements["group"],
) {
    return <group {...props}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.5, 0.01, 0.1]} />
            <meshPhongMaterial color={"#FF6F1E"} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[0.5, 0.01, 0.1]} />
            <meshPhongMaterial color={"#FF6F1E"} />
        </mesh>
        <mesh
            rotation={[0, -Math.PI / 6, 0]}
            position={[0, 0.05, 0]}
            renderOrder={-1}
        ></mesh>
        <group
            scale={[4, 1, 1]}
            rotation={[0, Math.PI / 4, 0]}>
            <mesh rotation={[0, -Math.PI / 4, 0]} >
                <cylinderGeometry args={[0.1, 0.1, 10, 4, 1, true]}
                />
                <meshBasicMaterial
                    side={DoubleSide}
                    color={"#FF6F1E"}
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
        </group>
        <group
            scale={[4, 1, 1]}
            rotation={[0, -Math.PI / 4, 0]}>
            <mesh rotation={[0, -Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 10, 4, 1, true]}
                />
                <meshBasicMaterial
                    side={DoubleSide}
                    color={"#FF6F1E"}
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
        </group>
    </group>;
}
