import { Box, CameraControls, Environment, GizmoHelper, GizmoViewport, Grid, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GroupSync } from "../utils/GroupSync";
import { useControls } from "leva";

export function Beam() {
    const { x } = useControls({
        x: { min: 0, value: 35, max: 100, step: 1 },
    });
    return <div css={{
        position: "fixed",
        inset: 0,
    }}>
        <Canvas>
            <PerspectiveCamera
                makeDefault
                fov={40}
                near={0.1}
                far={1000}
                position={[20, 20, 20]} />
            <CameraControls />
            <Grid
                position={[0, -0.01, 0]}
                args={[10, 10]}
                infiniteGrid
                cellSize={1}
                cellThickness={1}
                cellColor={"#606060"}
                sectionSize={10}
                sectionThickness={1}
                fadeDistance={70}
            />

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport />
            </GizmoHelper>

            <GroupSync
                position={[0, 1, 0]}
                onFrame={(g, _, delta) => {
                    g.rotation.x += delta;
                    g.rotation.y += 2 * delta;
                }}>
                <Box />
            </GroupSync>
        </Canvas>
    </div>;
}