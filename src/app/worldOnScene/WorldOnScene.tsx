import { v2, v3 } from "../../utils/v";
import { toFlatCart } from "../../utils/hax";
import * as _ from "lodash";
import { ParticleToken } from "./ParticleToken";
import { nowPlaytime, playActionRecoil } from "../PlaybackPanel";
import { Vector3 } from "three";
import { GroupSync } from "../../utils/GroupSync";
import { easeBackIn, easeBackOut } from "d3-ease";
import { SpawnerToken } from "./SpawnerToken";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useWorld, getStepAtPlaytime } from "../useWorld";
import { trustedEntries } from "../../utils/trustedRecord";
import { parsePosition } from "../../puzzle/terms/Position";
import { cellContentRecoil } from "../scene/cellContentRecoil";
import { ConsumerToken } from "./ConsumerToken";
import { directionOf } from "../../reactionSandbox/ParticleText";
import { worldAtStep } from "../../puzzle/world";
import { PredictedParticle } from "./PredictedParticle";
import { tuple } from "../../utils/tuple";


export const lerp = (a: number, b: number, t: number) =>
    a + t * (b - a);
export const x0y = ([x, y]: v2 | v3) => tuple(x, 0, y);

export const toFlatCartXz =
    (...args: Parameters<typeof toFlatCart>) => {
        const v = toFlatCart(...args);
        return [v[0], 0, v[1]] as v3;
    };

export function WorldOnScene() {
    const world = useWorld();
    const playAction = useRecoilValue(playActionRecoil);

    const particles = world.particles.map((p, i) => {
        const prev = world.prev?.particles[i];
        if (prev && prev.isRemoved) { return; }
        if (!prev && p.isRemoved) { return; }
        return { i, prev, p };
    }).filter(<T,>(x: T): x is NonNullable<T> => !!x);

    const actors = [
        ...trustedEntries(world.init.actors),
        ...trustedEntries(world.init.problem.actors),
    ];

    const setCellContent = useSetRecoilState(cellContentRecoil);

    return <>
        {Array.from({ length: 20 }, (_, i) => {
            const w1 = worldAtStep(
                world.init, 
                i + getStepAtPlaytime(world.step));
            if (w1.action !== "move") { return null; }
            return w1
                .particles
                .filter(p => !p.isRemoved)
                .map((p, j) => {
                    return <group
                        key={j}
                        position={x0y(toFlatCart(p.position))}
                        rotation={[
                            0,
                            -Math.PI / 3 * directionOf(p.velocity)[0],
                            0,
                        ]}
                    >
                        <PredictedParticle p={p} relStep={i} />
                    </group>;
                });
        })}

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
                                lerp(0.25, 0.75, t));
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
                                        lerp(0.75, 1.25, t));
                                }
                            } else {
                                g.position.set(
                                    ...x0y(toFlatCart(p.position)));
                                g.position.lerp(
                                    new Vector3(...x0y(toFlatCart(
                                        v2.add(p.position, p.velocity)))),
                                    lerp(-0.25, 0.25, t));
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
                        particle={p} />
                </GroupSync>;
            }))}
        {actors.map(([positionKey, a], i) => {
            const position = parsePosition(positionKey);
            if (a.kind === "spawner") {
                return <SpawnerToken
                    actor={a}
                    key={i}
                    position={toFlatCartXz(position)} />;
            }
            if (a.kind === "consumer") {
                return <ConsumerToken
                    actor={a}
                    key={i}
                    position={toFlatCartXz(position)} />;
            }
            if (a.kind === "mirror") {
                return <group
                    key={i}
                    rotation={[0, -Math.PI / 6 * a.direction, 0]}
                    position={toFlatCartXz(position)}
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
                    position={toFlatCartXz(position)}
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
