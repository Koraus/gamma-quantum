import { Actor } from "../../puzzle/terms/Actor";
import { ThreeElements } from "@react-three/fiber";
import { getParticleColors } from "./ParticleToken";
import { DoubleSide } from "three";

export function ConsumerToken({
    actor, ...props
}: {
    actor: Extract<Actor, { kind: "consumer" }>;
} & ThreeElements["group"]) {
    const colors = getParticleColors(actor.input);

    return <group {...props}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.01]} />
            <meshPhongMaterial color={"grey"} />
        </mesh>
        <mesh position={[0, 0.5, 0.5]}>
            <cylinderGeometry args={[0.01, 0.01, 1]} />
            <meshPhongMaterial color={"grey"} />
        </mesh>
        {colors.map((c, i) =>
            <mesh
                key={i}
                position={[0.1, 1 -0.025 - 0.055 * i, 0.5]}
            >
                <planeGeometry args={[0.2, 0.05]} />
                <meshPhongMaterial
                    color={c}
                    side={DoubleSide}
                />
            </mesh>)}

    </group>;
}
