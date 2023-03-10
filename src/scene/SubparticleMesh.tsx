import { Color, Vector3 } from "@react-three/fiber";
import { useMemo } from "react";
import { GroupSync } from "../utils/GroupSync";

export function SubparticleMesh({
    color,
    position,
}: {
    color: Color,
    position: Vector3,
}) {

    const periodSec = useMemo(() => 1.5 + Math.random() * 0.5, []);

    return <GroupSync
        position={position}
        onFrame={g => {
            const tSec = performance.now() / 1000;
            const y = Math.sin(tSec / periodSec * 2 * Math.PI);
            const s = 1 + 0.05 * y;
            g.scale.setScalar(s);
        }}
    >
        <mesh>
            <sphereGeometry args={[0.1]} />
            <meshPhongMaterial color={color} />
        </mesh>
    </GroupSync>;
}   