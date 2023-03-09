import { v2 } from "../utils/v";
import * as hg from "../utils/hg";
import { DirectionId, HalfDirectionId } from "../puzzle/direction";
import { Solution, SolutionDraft } from "../puzzle/Solution";
import { HexGrid } from "./HexGrid";
import { Mesh, Vector3 } from "three";
import { useRef, useState } from "react";
import { pipe } from "fp-ts/lib/function";
import update from "immutability-helper";
import { cursorToolRecoil } from "../CursorToolSelectorPanel";
import { useRecoilValue } from "recoil";
import { useSetSolution } from "../useSetSolution";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";


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

        const i = solution.actors
            .findIndex(a => v2.eq(a.position, hPos));

        switch (cursorTool.kind) {
            case "none": break;
            case "spawner": {
                if (i >= 0) { break; }
                setSolution(update(solution, {
                    actors: {
                        $push: [{
                            ...cursorTool,
                            direction:
                                Math.floor((cursorDirection % 12) / 2) as
                                DirectionId,
                            position: hPos,
                        }],
                    },
                }));
                break;
            }
            case "consumer": {
                if (i >= 0) { break; }
                setSolution(update(solution, {
                    actors: {
                        $push: [{
                            ...cursorTool,
                            position: hPos,
                        }],
                    },
                }));
                break;
            }
            case "mirror": {
                if (i >= 0) { break; }
                setSolution(update(solution, {
                    actors: {
                        $push: [{
                            direction:
                                (cursorDirection % 12) as
                                HalfDirectionId,
                            kind: "mirror",
                            position: hPos,
                        }],
                    },
                }));
                break;
            }
            case "trap": {
                if (i >= 0) { break; }
                setSolution(update(solution, {
                    actors: {
                        $push: [{
                            kind: "trap",
                            position: hPos,
                        }],
                    },
                }));
                break;
            }
            case "remove": {
                if (i < 0) { break; }
                setSolution(update(solution, {
                    actors: { $splice: [[i, 1]] },
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
