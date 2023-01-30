import { initialWorld } from "./puzzle/stepInPlace";
import { v2, v3 } from "./utils/v";
import { Cylinder, GizmoHelper, GizmoViewport, OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import { axialToFlatCart } from "./utils/hg";
import * as hg from "./utils/hg";
import { Solution } from "./puzzle/terms";
import { tuple } from "./utils/tuple";
import * as _ from "lodash";
import { ParticleToken } from "./ParticleToken";
import { HexGrid } from "./HexGrid";

export function* hgCircleDots(radius: number, center: v3 = [0, 0, 0]) {
    if (radius === 0) {
        yield center;
    } else {
        for (let j = 0; j < radius; j++) {
            const ps = [
                [radius, -j] as [number, number],
                [radius - j, -radius] as [number, number],
                [radius - j - 1, j + 1] as [number, number]
            ].map(hg.axialToCube);
            for (const p of ps) {
                yield p;
                yield v3.negate(p);
            }
        }
    }
}

const x0y = ([x, y]: v2 | v3) => tuple(x, 0, y);

export function MainScene({
    solution,
    world,
}: {
    solution: Solution,
    world: ReturnType<typeof initialWorld>;
}) {
    const axialToFlatCartXz = (...args: Parameters<typeof axialToFlatCart>) => {
        const v = axialToFlatCart(...args);
        return [v[0], 0, v[1]] as v3;
    };

    return <>
        <PerspectiveCamera
            makeDefault
            fov={40}
            near={0.1}
            far={1000}
            position={v3.scale(v3.from(1, Math.SQRT2, 1), 25)} />

        <OrbitControls enableDamping={false} />
        <HexGrid />
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 80]}
        >
            <GizmoViewport />
        </GizmoHelper>


        <directionalLight intensity={0.6} position={[-10, 30, 45]} />
        <ambientLight intensity={0.3} />
        <Cylinder args={[0.01, 0.01, 3]}>
            <meshBasicMaterial color={"lime"} />
        </ Cylinder>

        {Object.values(_.groupBy(world.particles, p => JSON.stringify(p.position)))
            .flatMap((ps, j) => ps.map((p, i) => <group
                key={`${j}_${i}`}
                position={v3.add(x0y(axialToFlatCart(p.position)), [0, i * 0.2, 0])}
            >
                <ParticleToken particle={p} />
            </group>))
        }
        {solution.actors.map((a, i) => {
            if (a.kind !== "spawner") { return null; }
            const p = a.output;
            const color = (() => {
                if (p.content[0] === "red" && p.content[1] === "green" && p.content[2] === "blue") { return "white"; }
                if (p.content[0] === "green" && p.content[1] === "blue") { return "cyan"; }
                if (p.content[0] === "red" && p.content[1] === "blue") { return "magenta"; }
                if (p.content[0] === "red" && p.content[1] === "green") { return "yellow"; }
                if (p.content === "red") { return "red"; }
                if (p.content === "blue") { return "blue"; }
                if (p.content === "green") { return "green"; }
                if (p.content === "gamma") { return "orange"; }
                throw "not supproted";
            })();
            return <group key={i} position={axialToFlatCartXz(a.position)}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.5, 0.1]} />
                    <meshPhongMaterial color={color} />
                </mesh>
                <group
                    rotation={[0, -Math.PI / 3 * a.direction, 0]}
                >
                    <mesh
                        position={[0, 0, 0.5]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry args={[0.05, 0.05, 1]} />
                        <meshPhongMaterial color={color} />
                    </mesh>
                </group>
            </group>
        })}
    </>;
}
