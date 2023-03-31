import { v2, v3 } from "../../utils/v";
import { GizmoHelper, GizmoViewport, PerspectiveCamera } from "@react-three/drei";
import { toFlatCart } from "../../utils/hax";
import { tuple } from "../../utils/tuple";
import * as _ from "lodash";
import { ParticleToken } from "./ParticleToken";
import { nowPlaytime, playActionRecoil } from "../PlaybackPanel";
import { Object3D, SpotLight, Vector3 } from "three";
import { GroupSync } from "../../utils/GroupSync";
import { easeBackIn, easeBackOut } from "d3-ease";
import { InteractiveBoard } from "./InteractiveBoard";
import { SpawnerToken } from "./SpawnerToken";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useWorld } from "../useWorld";
import { trustedEntries } from "../../utils/trustedRecord";
import { parsePosition } from "../../puzzle/terms/Position";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { cellContentRecoil } from "./cellContentRecoil";
import { ConsumerToken } from "./ConsumerToken";
import { MainCameraControls } from "./MainCameraControls";


const lerp = (a: number, b: number, t: number) =>
    a + t * (b - a);
const x0y = ([x, y]: v2 | v3) => tuple(x, 0, y);

export const axialToFlatCartXz =
    (...args: Parameters<typeof toFlatCart>) => {
        const v = toFlatCart(...args);
        return [v[0], 0, v[1]] as v3;
    };

export function MainScene() {
    const world = useWorld();
    const playAction = useRecoilValue(playActionRecoil);

    const particles = world.particles.map((p, i) => {
        const prev = world.prev?.particles[i];
        if (prev && prev.isRemoved) { return; }
        if (!prev && p.isRemoved) { return; }
        return { i, prev, p };
    }).filter(<T,>(x: T): x is NonNullable<T> => !!x);

    const actors = [
        ...trustedEntries(world.actors),
        ...trustedEntries(world.problem.actors),
    ];

    const setCellContent = useSetRecoilState(cellContentRecoil);
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

        {Object.values(_.groupBy(particles, p => JSON.stringify(p.p.position)))
            .flatMap((ps) => ps.map(({ p, prev, i }, j) => {
                return <GroupSync
                    key={`${i}`}
                    onFrame={g => {
                        const t = nowPlaytime(playAction) - world.step;

                        if (world.action === "move" && prev) {
                            g.position.set(
                                ...x0y(toFlatCart(prev.position)));
                            g.position.lerp(
                                new Vector3(...x0y(toFlatCart(p.position))),
                                lerp(0.25, 0.75, t),
                            );
                        } else {
                            if (t < 0.5) {
                                if (prev) {
                                    g.position.set(
                                        ...x0y(toFlatCart(
                                            v2.sub(
                                                prev.position,
                                                prev.velocity))));
                                    g.position.lerp(
                                        new Vector3(...x0y(toFlatCart(
                                            prev.position))),
                                        lerp(0.75, 1.25, t),
                                    );
                                }
                            } else {
                                g.position.set(
                                    ...x0y(toFlatCart(p.position)));
                                g.position.lerp(
                                    new Vector3(...x0y(toFlatCart(
                                        v2.add(p.position, p.velocity)))),
                                    lerp(-0.25, 0.25, t),
                                );
                            }
                        }
                        g.position.y = 0.1 + j * 0.2;

                        if (!prev) {
                            // appear
                            g.scale.setScalar(easeBackOut(t));
                        } else if (p.isRemoved) {
                            // disappear
                            g.scale.setScalar(1 - easeBackIn(t));
                        } else {
                            // move
                            g.scale.setScalar(1);
                        }

                    }}
                    position={v3.add(
                        x0y(toFlatCart((prev ?? p).position)),
                        [0, 0.1 + j * 0.2, 0])}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        setCellContent(ps.map(p => p.p));
                    }}
                >
                    <ParticleToken
                        particle={p}
                    />
                </GroupSync>;
            }))
        }
        {actors.map(([positionKey, a], i) => {
            const position = parsePosition(positionKey);
            if (a.kind === "spawner") {
                return <SpawnerToken
                    actor={a}
                    key={i}
                    position={axialToFlatCartXz(position)}
                />;
            }
            if (a.kind === "consumer") {
                return <ConsumerToken
                    actor={a}
                    key={i}
                    position={axialToFlatCartXz(position)}
                />;
            }
            if (a.kind === "mirror") {
                return <group
                    key={i}
                    rotation={[0, -Math.PI / 6 * a.direction, 0]}
                    position={axialToFlatCartXz(position)}
                >
                    <mesh rotation={[0, 0, 0]}>
                        <boxGeometry args={[1, 0.5, 0.03]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                </group>;
            }
            if (a.kind === "trap") {
                return <group
                    key={i}
                    position={axialToFlatCartXz(position)}
                >
                    <mesh rotation={[0, Math.PI / 4, 0]}>
                        <boxGeometry args={[0.5, 0.01, 0.1]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                    <mesh rotation={[0, -Math.PI / 4, 0]}>
                        <boxGeometry args={[0.5, 0.01, 0.1]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                </group>;
            }
        })}
    </>;
}
