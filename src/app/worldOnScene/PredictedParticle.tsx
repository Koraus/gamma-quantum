import { ThreeElements } from "@react-three/fiber";
import { enumerateSubparticles } from "../../puzzle/reactions/enumerateProductCombinations";
import { ParticleState } from "../../puzzle/world";
import memoize from "memoizee";
import { CylinderGeometry, MeshPhongMaterial } from "three";

const predictedSubparticleGeometry = new CylinderGeometry(0.01, 0.01, 1);
const predictedSubparticleMaterial = memoize((color, opacity) =>
    new MeshPhongMaterial({
        color,
        transparent: true,
        opacity,
    }));

export function PredictedParticle({
    p, relStep,
}: {
    p: ParticleState, relStep: number
} & ThreeElements["mesh"]) {
    return <>{[...enumerateSubparticles(p)].map((sp, j) => {
        const opacity = 1 - (relStep / 21);
        const color = sp === "gamma" ? "white" : sp;
        return <mesh
            position={[0.1 * j, 0, -0.5]}
            rotation={[Math.PI / 2, 0, 0]}
            key={j}
        >
            <primitive
                attach="geometry"
                object={predictedSubparticleGeometry}
            />
            <primitive
                attach="material"
                object={predictedSubparticleMaterial(color, opacity)}
            />
        </mesh>;
    })}
    </>;
}
