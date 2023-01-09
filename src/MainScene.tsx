import { initialWorld } from "./puzzle/stepInPlace";
import { v3 } from "./utils/v";
import { Box, GizmoHelper, GizmoViewport, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { axialToFlatCart } from "./utils/hg";
import * as hg from "./utils/hg";
import { Solution } from "./puzzle/terms";

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

export function* hgDiscDots(radius: number, center: v3 = [0, 0, 0]) {
    for (let i = 0; i < radius; i++) {
        yield* hgCircleDots(i, center);
    }
}


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
        <Box><meshPhongMaterial wireframe /></Box>
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 80]}
        >
            <GizmoViewport />
        </GizmoHelper>
        <Grid
            cellColor={"blue"}
            cellSize={1}
            sectionSize={10}
            infiniteGrid />

        <directionalLight intensity={0.6} position={[-10, 30, 45]} />
        <ambientLight intensity={0.3} />

        {[...hgDiscDots(10)].map((d, i) => {
            return <group key={i} position={axialToFlatCartXz(d)}>
                <mesh>
                    <sphereGeometry args={[0.05]} />
                </mesh>
            </group>
        })}

        {world.particles.map((p, i) => {
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
            return <group key={i} position={axialToFlatCartXz(p.position)}>
                <mesh>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshPhongMaterial color={color} />
                </mesh>
                <group
                    rotation={[0, -Math.PI / 3 * p.direction, 0]}
                >
                    <mesh
                        position={[0, 0, 0.5]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry args={[0.05, 0.05, 1]} />
                        <meshPhongMaterial color={color} />
                    </mesh>
                </group>
            </group>;
        })}
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
