import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { heldKeys } from "../../utils/heldKeys";
import { useWindowEvent } from "../../utils/useWindowEvent";

export function MainCameraControls() {
    const cameraControlsRef = useRef<CameraControls>(null);
    useFrame((_, delta) => {
        const cc = cameraControlsRef.current;
        if (!cc) { return; }

        const isShift = heldKeys["ShiftLeft"] || heldKeys["ShiftRight"];

        const moveStep = 0.5 * cc.distance * (isShift ? 3 : 1) * delta;
        if (heldKeys["KeyW"]) { cc.forward(moveStep, false); }
        if (heldKeys["KeyS"]) { cc.forward(-moveStep, false); }
        if (heldKeys["KeyD"]) { cc.truck(moveStep, 0, false); }
        if (heldKeys["KeyA"]) { cc.truck(-moveStep, 0, false); }

        const rotateStep = 0.5 * Math.PI * (isShift ? 3 : 1) * delta;
        if (heldKeys["ArrowLeft"]) { cc.rotate(-rotateStep, 0, false); }
        if (heldKeys["ArrowRight"]) { cc.rotate(rotateStep, 0, false); }
        if (heldKeys["ArrowUp"]) { cc.rotate(0, -rotateStep, false); }
        if (heldKeys["ArrowDown"]) { cc.rotate(0, rotateStep, false); }

        const dollyStep = 50 * (isShift ? 3 : 1) * delta;
        if (heldKeys["PageUp"]) { cc.dolly(dollyStep, false); }
        if (heldKeys["PageDown"]) { cc.dolly(-dollyStep, false); }
    });
    useWindowEvent("keydown", ev => {
        const cc = cameraControlsRef.current;
        if (!cc) { return; }

        if (ev.code === "KeyF") {
            cc.rotatePolarTo((cc.polarAngle < 0.01 ? 0.25 : 0) * Math.PI, true);
            cc.dollyTo(cc.minDistance * 1.5, true);
        }

        if (ev.code === "KeyC") {
            cc.moveTo(0, 0, 0, true);
        }
    });
    return <CameraControls
        ref={cameraControlsRef}
        draggingSmoothTime={0.05}
        verticalDragToForward
        minDistance={15}
        maxDistance={100}
        maxPolarAngle={0.35 * Math.PI}
        mouseButtons={{
            wheel: 8,
            left: 1,
            middle: 8,
            right: 2,
        }} />;
}
