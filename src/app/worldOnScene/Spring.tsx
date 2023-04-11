import { ThreeElements } from "@react-three/fiber";
import { enumerateSubparticles } from "../../puzzle/reactions/enumerateProductCombinations";
import { ParticleState } from "../../puzzle/world";
import { CatmullRomCurve3, MeshBasicMaterial, Vector3 } from "three";
import { subparticleColor } from "./subparticleColor";
import memoizee from "memoizee";

const predictedSubparticleMaterial = memoizee((color, opacity) =>
    new MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
    }));

export function Spring({
    p, relStep,
}: {
    p: ParticleState, relStep: number,
} & ThreeElements["mesh"]) {
    const r = 0.1;
    const n = 1;

    const path = new CatmullRomCurve3(Array.from({ length: 100 },
        (_, i) => {
            const t = i / (100 - 1);
            return new Vector3(r * Math.sin(t * n * 2 * Math.PI),
                t,
                - r * Math.cos(t * n * 2 * Math.PI));
        }));

    return <>{enumerateSubparticles(p).map((sp, j) => {
        const rtx = subparticleColor[sp] === "#50ff00" ? Math.PI / 3 : 0;
        const color = subparticleColor[sp];
        const opacity = 1 - (relStep / 21);

        return <mesh
            position={[0.1 * j, 0.2, 0]}
            key={j}
            rotation={[
                -Math.PI / 2,
                rtx,
                0
            ]}>
            <tubeBufferGeometry args={[path, 83, 0.01, 16]} />
            <primitive
                attach="material"
                object={predictedSubparticleMaterial(color, opacity)}
                key={`${color}/${opacity}`}
            />
        </mesh>;
    }).toArray()}
    </>;
}