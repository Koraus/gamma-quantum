import { SpawnerActor } from "./puzzle/terms";
import { ThreeElements } from "@react-three/fiber";

export function SpawnerToken({
    actor, ...props
}: {
    actor: SpawnerActor;
} & ThreeElements["group"]) {
    const colors = (Array.isArray(actor.output.content)
        ? actor.output.content
        : [actor.output.content])
        .map(c => c === "gamma" ? "white" : c);

    return <group {...props}>
        {colors.map((color, j) => <mesh
            key={j} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5 - j * 0.1, 0.05]} />
            <meshPhongMaterial color={color} />
        </mesh>
        )}
        <group
            rotation={[0, -Math.PI / 3 * actor.direction, 0]}
        >
            <mesh
                position={[0, 0, 0.5]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <cylinderGeometry args={[0.05, 0.05, 0.6]} />
                <meshPhongMaterial />
            </mesh>
        </group>
    </group>;
}
