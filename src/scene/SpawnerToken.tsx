import { SpawnerActor } from "../puzzle/terms/Solution";
import { ThreeElements } from "@react-three/fiber";
import { getParticleColors } from "./ParticleToken";

export function SpawnerToken({
    actor, ...props
}: {
    actor: SpawnerActor;
} & ThreeElements["group"]) {
    const colors = getParticleColors(actor.output);

    return <group {...props}>
        {colors.map((color, j) => <mesh
            key={j} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4 - j * 0.05, 0.01]} />
            <meshPhongMaterial color={color} />
        </mesh>)}
        <group
            rotation={[0, -Math.PI / 3 * actor.direction, 0]}
        >
            <mesh
                position={[0, 0, 0.6]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <cylinderGeometry args={[0.008, 0.003, 0.6]} />
                <meshPhongMaterial />
            </mesh>
        </group>
    </group>;
}
