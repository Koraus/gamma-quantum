import { initialWorld } from "./puzzle/stepInPlace";
import { v3 } from "./utils/v";
import { Box, GizmoHelper, GizmoViewport, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { axialToFlatCart } from "./utils/hg";


export function MainScene({
    world,
}: {
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

        {world.particles.map((p, i) => {
            const color = (() => {
                if (p.content === "red") { return "red"; }
                if (p.content === "blue") { return "blue"; }
                if (p.content === "green") { return "green"; }
                if (p.content === "gamma") { throw "not impleneted"; }
                if (p.content[0] === "red" && p.content[1] === "green") { return "yellow"; }
                if (p.content[0] === "red" && p.content[1] === "blue") { return "magenta"; }
                if (p.content[0] === "green" && p.content[1] === "blue") { return "cyan"; }
                if (p.content[0] === "red" && p.content[1] === "green" && p.content[2] === "blue") { return "white"; }
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
    </>;
}
