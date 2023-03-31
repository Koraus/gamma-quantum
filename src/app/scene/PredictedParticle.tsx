import { ThreeElements } from "@react-three/fiber";
import { enumerateSubparticles } from "../../puzzle/reactions/enumerateProductCombinations";
import { ParticleState } from "../../puzzle/world";


export function PredictedParticle({
    p, relStep,
}: {
    p: ParticleState, relStep: number
} & ThreeElements["mesh"]) {
    return <>{[...enumerateSubparticles(p)].map((sp, j) => {
        const opacity = 1 - ((relStep + 1) / 21);
        return <mesh
            position={[0.1 * j, 0, 0.5]}
            rotation={[Math.PI / 2, 0, 0]}
            key={j}
        >
            <cylinderGeometry args={[0.01, 0.01, 1]} />
            <meshPhongMaterial color={
                sp === "gamma" ? "white" : sp}
                transparent
                opacity={opacity}
            />
        </mesh>;
    })}
    </>;
}
