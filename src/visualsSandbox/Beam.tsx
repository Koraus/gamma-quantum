import { Box, CameraControls, GizmoHelper, Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GroupSync } from "../utils/GroupSync";

export function Beam() {
    return <div css={{
        position: "fixed",
        inset: 0,
    }}>
        <Canvas>
            <CameraControls />
            <Grid />
            <GizmoHelper />

            <GroupSync onFrame={(g, _, delta) => {
                g.rotation.x += delta;
                g.rotation.y += 2 * delta;
            }}>
            <Box />
            </GroupSync>
        </Canvas>
    </div>;
}