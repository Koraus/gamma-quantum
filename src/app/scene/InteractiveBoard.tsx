import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { DirectionId, HalfDirectionId } from "../../puzzle/world/direction";
import { Solution, SolutionDraft, SolutionDraftDecoder } from "../../puzzle/terms/Solution";
import { HexGrid } from "./HexGrid";
import { Mesh, Vector3 } from "three";
import { useRef, useState } from "react";
import { pipe } from "fp-ts/lib/function";
import update from "immutability-helper";
import { cursorToolRecoil } from "../CursorToolSelectorPanel";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useSetSolution } from "../useSetSolution";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";
import { keyifyPosition, parsePosition } from "../../puzzle/terms/Position";
import { trustedKeys } from "../../utils/trustedRecord";
import { keyifyProblem } from "../../puzzle/terms/Problem";
import { isLeft } from "fp-ts/Either";
import { useWindowKeyDown } from "../../utils/useWindowKeyDown";
import { ghostSolutionRecoil } from "./ghostSolutionRecoil";
import { Plane } from "@react-three/drei";


export function InteractiveBoard() {
    const cursorTool = useRecoilValue(cursorToolRecoil);
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const _setSolution = useSetSolution();
    const setSolution = (s: SolutionDraft | Solution) => {
        if (isLeft(SolutionDraftDecoder.decode(s))) { return; }
        _setSolution(
            "solvedAtStep" in s
                ? update(s, { $unset: ["solvedAtStep"] })
                : s);
    };
    const cursorRef = useRef<Mesh>(null);
    const [cursorDirection, setCursorDirection] = useState(0);
    const normalizedDirection =
        cursorDirection % 12
        + ((cursorDirection < 0) ? 12 : 0);

    const setGhostSolution = useSetRecoilState(ghostSolutionRecoil);

    const applyCursor = (hPos: v2) => {

        const hPosKey = keyifyPosition(hPos);
        setGhostSolution(undefined);
        switch (cursorTool.kind) {
            case "none": break;
            case "spawner": {
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    Math.floor((normalizedDirection) / 2) as
                                    DirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "consumer": {
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
                setSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    normalizedDirection as HalfDirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "trap": {
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

    const applyGhostCursor = (hPos: v2) => {

        const hPosKey = keyifyPosition(hPos);
        switch (cursorTool.kind) {
            case "none": break;
            case "spawner": {
                setGhostSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    Math.floor((normalizedDirection) / 2) as
                                    DirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "consumer": {
                setGhostSolution(update(solution, {
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
                setGhostSolution(update(solution, {
                    actors: {
                        [hPosKey]: {
                            $set: {
                                ...cursorTool,
                                direction:
                                    normalizedDirection as HalfDirectionId,
                            },
                        },
                    },
                }));
                break;
            }
            case "trap": {
                setGhostSolution(update(solution, {
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
                setGhostSolution(update(solution, {
                    actors: { $unset: [hPosKey] },
                }));
                break;
            }
        }

    };

    useWindowKeyDown((e) => {
        const step = (cursorTool.kind === "mirror" ? 1 : 2);
        if (e.code === "KeyR") {
            setCursorDirection(
                cursorDirection + (e.shiftKey ? (-1) : 1) * step,
            );
        }
    });

    return <group>
        <HexGrid
            key={keyifyProblem(solution.problem)}
            positions={trustedKeys(solution.problem.positions)
                .map(parsePosition)}
            positionsMode={solution.problem.positionsMode}
        />
        <Plane
            args={[100, 100]}
            rotation={[-Math.PI / 2, 0, 0]}

            onPointerMove={ev => {
                const cursorEl = cursorRef.current;
                if (!cursorEl) { return; }
                cursorEl.position.copy(ev.unprojectedPoint);
                cursorEl.position
                    .addScaledVector(ev.ray.direction, ev.distance);
                cursorEl.position.copy(pipe(
                    [cursorEl.position.x, cursorEl.position.z],
                    hax.fromFlatCart,
                    hax.round,
                    hax.toFlatCart,
                    ([x, y]) => new Vector3(x, 0, y),
                ));
                // cursorEl.scale.setScalar(ev.distance * 0.02);
                const hPos = pipe(
                    ev.unprojectedPoint
                        .clone()
                        .addScaledVector(ev.ray.direction, ev.distance),
                    ({ x, z }) => [x, z] as v2,
                    hax.fromFlatCart,
                    hax.round,
                    ([x, y]) => [x, y] as v2,
                );
                applyGhostCursor(hPos);
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
                        hax.fromFlatCart,
                        hax.round,
                        ([x, y]) => [x, y] as v2,
                    );

                    applyCursor(hPos);
                }
            }}
        >
            <meshBasicMaterial
                transparent
                opacity={0}
                alphaTest={1}
           
        />
        </Plane>
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
