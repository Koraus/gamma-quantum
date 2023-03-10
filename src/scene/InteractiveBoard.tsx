import { v2 } from "../utils/v";
import * as hg from "../utils/hg";
import { DirectionId, HalfDirectionId } from "../puzzle/direction";
import { Solution, SolutionDraft } from "../puzzle/terms/Solution";
import { HexGrid } from "./HexGrid";
import { Mesh, Vector3 } from "three";
import { useRef, useState } from "react";
import { pipe } from "fp-ts/lib/function";
import update from "immutability-helper";
import { cursorToolRecoil } from "../CursorToolSelectorPanel";
import { useRecoilValue } from "recoil";
import { useSetSolution } from "../useSetSolution";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";
import { keyifyPosition } from "../puzzle/terms/Position";


export function InteractiveBoard() {
    const cursorTool = useRecoilValue(cursorToolRecoil);
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const _setSolution = useSetSolution();
    const setSolution = (s: SolutionDraft | Solution) => _setSolution(
        "solvedAtStep" in s
            ? update(s, { $unset: ["solvedAtStep"] })
            : s);
    const cursorRef = useRef<Mesh>(null);
    const [cursorDirection, setCursorDirection] = useState(0);

    const applyCursor = (hPos: v2) => {

        const hPosKey = keyifyPosition(hPos);

        switch (cursorTool.kind) {
            case "none": break;
            case "spawner": {
                if (solution.actors[hPosKey]) { return; }
                if (solution.problem.actors[hPosKey]) { return; }
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    Math.floor((cursorDirection % 12) / 2) as
                                    DirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "consumer": {
                if (solution.actors[hPosKey]) { return; }
                if (solution.problem.actors[hPosKey]) { return; }
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                            },
                        },
                    },
                }));
                break;
            }
            case "mirror": {
                if (solution.actors[hPosKey]) { return; }
                if (solution.problem.actors[hPosKey]) { return; }
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    (cursorDirection % 12) as
                                    HalfDirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "trap": {
                if (solution.actors[hPosKey]) { return; }
                if (solution.problem.actors[hPosKey]) { return; }
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                            },
                        },
                    },
                }));
                break;
            }
            case "remove": {
                setSolution(update(solution, {
                    actors: { $unset: [hPosKey] },
                }));
                break;
            }
        }
    };

    return <group>
        <HexGrid
            onPointerMove={ev => {
                const cursorEl = cursorRef.current;
                if (!cursorEl) { return; }
                cursorEl.position.copy(ev.unprojectedPoint);
                cursorEl.position
                    .addScaledVector(ev.ray.direction, ev.distance);
                cursorEl.position.copy(pipe(
                    [cursorEl.position.x, cursorEl.position.z],
                    hg.flatCartToAxial,
                    hg.axialToCube,
                    hg.cubeRound,
                    hg.axialToFlatCart,
                    ([x, y]) => new Vector3(x, 0, y),
                ));
                // cursorEl.scale.setScalar(ev.distance * 0.02);
            }}
            onWheel={(e) => {
                const step = (cursorTool.kind === "mirror" ? 1 : 2);
                setCursorDirection(
                    cursorDirection + Math.sign(-e.deltaY) * step);
            }}
            onPointerUp={ev => {
                if (ev.button === 0) {
                    const hPos = pipe(
                        ev.unprojectedPoint
                            .clone()
                            .addScaledVector(ev.ray.direction, ev.distance),
                        ({ x, z }) => [x, z] as v2,
                        hg.flatCartToAxial,
                        hg.axialToCube,
                        hg.cubeRound,
                        ([x, y]) => [x, y] as v2,
                    );

                    applyCursor(hPos);
                }
            }} />
        {cursorTool.kind !== "none" &&
            <mesh
                ref={cursorRef}
                rotation={[
                    0,
                    -Math.PI / 6
                    * (cursorTool.kind === "spawner"
                        ? Math.floor(cursorDirection / 2) * 2
                        : cursorDirection),
                    0,
                ]}
            >
                <sphereGeometry args={[0.3]} />
                <meshPhongMaterial
                    transparent
                    opacity={0.5}
                    color={cursorTool.kind === "remove" ? "red" : "white"} />
                {(cursorTool.kind === "mirror" || cursorTool.kind === "spawner")
                    && <mesh
                        position={[0, 0, 0.4]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                        <meshPhongMaterial
                            transparent
                            opacity={0.5}
                            color={"white"} />
                    </mesh>}
            </mesh>
        }
    </group >;
}
