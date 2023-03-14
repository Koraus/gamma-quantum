import { v2, v3 } from "../utils/v";
import { GizmoHelper, GizmoViewport, PerspectiveCamera, CameraControls } from "@react-three/drei";
import { toFlatCart } from "../utils/hax";
import { tuple } from "../utils/tuple";
import * as _ from "lodash";
import { ParticleToken } from "./ParticleToken";
import { nowPlaytime, playActionRecoil } from "../PlaybackPanel";
import { Vector3 } from "three";
import { GroupSync } from "../utils/GroupSync";
import { easeBackIn, easeBackOut, easeSinInOut } from "d3-ease";
import { InteractiveBoard } from "./InteractiveBoard";
import { SpawnerToken } from "./SpawnerToken";
import { useRecoilValue } from "recoil";
import { useWorld } from "../useWorld";
import { trustedEntries } from "../utils/trustedRecord";
import { parsePosition } from "../puzzle/terms/Position";
import { useEffect, useRef, useState } from "react";
import { A } from "ts-toolbelt";

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

    const ref = useRef<CameraControls>(null);
    useEffect(() => {
        const moveCamera = (e: KeyboardEvent) => {
            const step = 1;         
            if (ref !== null) {
                if (e.code === "KeyD") {
                    ref.current.truck(step, 0, true);
                }
                if (e.code === "KeyA") {
                    ref.current.truck(-step, 0, true);
                }
                if (e.code === "KeyW") {
                    ref.current.forward(step, true);
                }
                if (e.code === "KeyS") {
                    ref.current.forward(-step, true);
                }
            }
        };
        window.addEventListener("keydown", moveCamera);
        return () => {
            window.removeEventListener("keydown", moveCamera);
        };
    });

    return <>
        <PerspectiveCamera
            makeDefault
            fov={40}
            near={0.1}
            far={1000}
            position={v3.scale(v3.from(1, Math.SQRT2, 1), 25)} />
        <CameraControls
            ref={ref}
            draggingSmoothTime={0.05}
            mouseButtons={{
                wheel: 0,
                left: 2,
                middle: 8,
                right: 1,
            }} />
        <InteractiveBoard />
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 110]}
        >
            <GizmoViewport />
        </GizmoHelper>


        <directionalLight intensity={0.6} position={[-10, 30, 45]} />
        <ambientLight intensity={0.3} />

        {Object.values(_.groupBy(particles, p => JSON.stringify(p.p.position)))
            .flatMap((ps) => ps.map(({ p, prev, i }, j) => {
                return <GroupSync
                    key={`${i}`}
                    onFrame={g => {
                        const t = nowPlaytime(playAction) - world.step;

                        if (!prev) {
                            // appear
                            g.scale.setScalar(easeBackOut(t));
                            g.position.set(...x0y(toFlatCart(p.position)));
                        } else if (p.isRemoved) {
                            // disappear
                            g.scale.setScalar(1 - easeBackIn(t));
                            g.position.set(...x0y(toFlatCart(p.position)));
                        } else {
                            // move
                            g.scale.setScalar(1);
                            g.position.set(
                                ...x0y(toFlatCart(prev.position)));
                            g.position.lerp(
                                new Vector3(
                                    ...x0y(toFlatCart(p.position))),
                                easeSinInOut(t));
                            g.position.y = 0.1 + j * 0.2;
                        }

                    }}
                    position={v3.add(
                        x0y(toFlatCart((prev ?? p).position)),
                        [0, 0.1 + j * 0.2, 0])}
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
                return <group key={i} position={axialToFlatCartXz(position)}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.5, 0.01]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                </group>;
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
