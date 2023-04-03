import { v3 } from "../../utils/v";
import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { Object3D, SpotLight } from "three";
import { InteractiveBoard } from "./InteractiveBoard";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MainCameraControls } from "./MainCameraControls";
import { WorldOnScene } from "../worldOnScene/WorldOnScene";
import { HexGrid } from "./HexGrid";



export function MainScene() {

    const spotLightRef = useRef<SpotLight>(null);
    const spotLightTargetRef = useRef<Object3D>(null);
    useFrame(({ camera }) => {
        const spotLight = spotLightRef.current;
        if (!spotLight) { return; }
        if (!spotLightTargetRef.current) { return; }

        spotLight.position.copy(camera.position);
        spotLight.target = spotLightTargetRef.current;
        spotLight.power = Math.pow(camera.position.y, 1.3) * 500;
    });

    return <>
        <color attach="background" args={["#000001"]} />

        {/* <ambientLight intensity={1} /> */}
        <spotLight
            ref={spotLightRef}
            penumbra={0.99}
            angle={0.95}
            intensity={1}
            power={1} // is set through useFrame
        />
        <PerspectiveCamera
            makeDefault
            fov={60}
            near={0.1}
            far={1000}
            position={v3.scale(v3.from(1, Math.SQRT2, 1), 25)}
        >
            <object3D ref={spotLightTargetRef} position={[0, 0, -1]} />
        </PerspectiveCamera>
        <MainCameraControls />
        <InteractiveBoard />
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 110]}
        >
            <GizmoViewport />
        </GizmoHelper>

        <HexGrid />
        <WorldOnScene />
    </>;
}
