import { v2, v3 } from "../utils/v";
import { GizmoHelper, GizmoViewport, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { axialToFlatCart } from "../utils/hg";
import * as hg from "../utils/hg";
import { tuple } from "../utils/tuple";
import * as _ from "lodash";
import { ParticleToken } from "./ParticleToken";
import { nowPlaytime, playActionRecoil } from "../PlaybackPanel";
import { Vector3 } from "three";
import { GroupSync } from "../utils/GroupSync";
import { easeBackIn, easeBackOut, easeSinInOut } from "d3-ease";
import { cursorToolRecoil } from "../CursorToolSelectorPanel";
import { InteractiveBoard } from "./InteractiveBoard";
import { SpawnerToken } from "./SpawnerToken";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";
import { useWorld } from "../useWorld";
import { useSetSolution } from "../useSetSolution";

export function* hgCircleDots(radius: number, center: v3 = [0, 0, 0]) {
    if (radius === 0) {
        yield center;
    } else {
        for (let j = 0; j < radius; j++) {
            const ps = [
                [radius, -j] as [number, number],
                [radius - j, -radius] as [number, number],
                [radius - j - 1, j + 1] as [number, number],
            ].map(hg.axialToCube);
            for (const p of ps) {
                yield p;
                yield v3.negate(p);
            }
        }
    }
}

const x0y = ([x, y]: v2 | v3) => tuple(x, 0, y);


export const axialToFlatCartXz =
    (...args: Parameters<typeof axialToFlatCart>) => {
        const v = axialToFlatCart(...args);
        return [v[0], 0, v[1]] as v3;
    };

export function MainScene() {
    const cursorTool = useRecoilValue(cursorToolRecoil);
    const solutionState = tuple(
        useRecoilValue(solutionManagerRecoil).currentSolution,
        useSetSolution(),
    );
    const world = useWorld();
    const playAction = useRecoilValue(playActionRecoil);

    const [solution] = solutionState;
    const particles = world.particles.map((p, i) => {
        const prev = world.prev?.particles[i];
        if (prev && prev.isRemoved) { return; }
        if (!prev && p.isRemoved) { return; }
        return { i, prev, p };
    }).filter(<T,>(x: T): x is NonNullable<T> => !!x);

    return <>
        <PerspectiveCamera
            makeDefault
            fov={40}
            near={0.1}
            far={1000}
            position={v3.scale(v3.from(1, Math.SQRT2, 1), 25)} />

        <OrbitControls enableDamping={false} />
        <InteractiveBoard
            solutionState={solutionState}
            cursorTool={cursorTool}
        />
        <GizmoHelper
            alignment="bottom-right"
            margin={[80, 80]}
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
                            g.position.set(...x0y(axialToFlatCart(p.position)));
                        } else if (p.isRemoved) {
                            // disappear
                            g.scale.setScalar(1 - easeBackIn(t));
                            g.position.set(...x0y(axialToFlatCart(p.position)));
                        } else {
                            // move
                            g.scale.setScalar(1);
                            g.position.set(
                                ...x0y(axialToFlatCart(prev.position)));
                            g.position.lerp(
                                new Vector3(
                                    ...x0y(axialToFlatCart(p.position))),
                                easeSinInOut(t));
                            g.position.y = j * 0.2;
                        }

                    }}
                    position={v3.add(
                        x0y(axialToFlatCart((prev ?? p).position)),
                        [0, j * 0.2, 0])}
                >
                    <ParticleToken
                        particle={p}
                    />
                </GroupSync>;
            }))
        }
        {solution.actors.map((a, i) => {
            if (a.kind === "spawner") {
                return <SpawnerToken
                    actor={a}
                    key={i}
                    position={axialToFlatCartXz(a.position)}
                />;
            }
            if (a.kind === "consumer") {
                return <group key={i} position={axialToFlatCartXz(a.position)}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.5, 0.05]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                </group>;
            }
            if (a.kind === "mirror") {
                return <group
                    key={i}
                    rotation={[0, -Math.PI / 6 * a.direction, 0]}
                    position={axialToFlatCartXz(a.position)}
                >
                    <mesh rotation={[0, 0, 0]}>
                        <boxGeometry args={[1, 0.5, 0.05]} />
                        <meshPhongMaterial color={"grey"} />
                    </mesh>
                </group>;
            }
            if (a.kind === "trap") {
                return <group
                    key={i}
                    position={axialToFlatCartXz(a.position)}
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
