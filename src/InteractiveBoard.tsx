import { v2 } from "./utils/v";
import * as hg from "./utils/hg";
import { DirectionId, HalfDirectionId } from "./puzzle/direction";
import { SolutionDraft } from "./puzzle/Solution";
import { HexGrid } from "./HexGrid";
import { StateProp } from "./utils/StateProp";
import { Mesh, Vector3 } from "three";
import { useRef, useState } from "react";
import { apipe } from "./utils/apipe";
import update from "immutability-helper";
import { CursorTool } from "./CursorToolSelectorPanel";


export function InteractiveBoard({
    cursorTool, solutionState: [solution, setSolution],
}: {
    cursorTool: CursorTool;
    solutionState: StateProp<SolutionDraft>;
}) {

    const cursorRef = useRef<Mesh>(null);
    const [cursorDirection, setCursorDirection] = useState(0);

    return <group>
        <HexGrid
            onPointerMove={ev => {
                const cursorEl = cursorRef.current;
                if (!cursorEl) { return; }
                cursorEl.position.copy(ev.unprojectedPoint);
                cursorEl.position.addScaledVector(ev.ray.direction, ev.distance);
                cursorEl.position.copy(apipe(
                    [cursorEl.position.x, cursorEl.position.z],
                    hg.flatCartToAxial,
                    hg.axialToCube,
                    hg.cubeRound,
                    hg.axialToFlatCart,
                    ([x, y]) => new Vector3(x, 0, y)
                ));
                // cursorEl.scale.setScalar(ev.distance * 0.02);
            }}
            onPointerUp={ev => {
                if (ev.button === 2) {
                    setCursorDirection(cursorDirection + (cursorTool.kind === "mirror" ? 1 : 2));
                }
                if (ev.button === 0) {
                    const hPos = apipe(
                        ev.unprojectedPoint
                            .clone()
                            .addScaledVector(ev.ray.direction, ev.distance),
                        ({ x, z }) => [x, z] as v2,
                        hg.flatCartToAxial,
                        hg.axialToCube,
                        hg.cubeRound,
                        ([x, y]) => [x, y] as v2
                    );

                    const i = solution.actors.findIndex(a => v2.eq(a.position, hPos));

                    switch (cursorTool.kind) {
                        case "none": break;
                        case "spawner": {
                            if (i >= 0) { break; }
                            setSolution(update(solution, {
                                actors: {
                                    $push: [{
                                        ...cursorTool,
                                        direction: (cursorDirection % 12) / 2 as DirectionId,
                                        position: hPos
                                    }]
                                }
                            }));
                            break;
                        }
                        case "consumer": {
                            if (i >= 0) { break; }
                            setSolution(update(solution, {
                                actors: {
                                    $push: [{
                                        ...cursorTool,
                                        position: hPos
                                    }]
                                }
                            }));
                            break;
                        }
                        case "mirror": {
                            if (i >= 0) { break; }
                            setSolution(update(solution, {
                                actors: {
                                    $push: [{
                                        direction: (cursorDirection % 12) as HalfDirectionId,
                                        kind: "mirror",
                                        position: hPos
                                    }]
                                }
                            }));
                            break;
                        }
                        case "trap": {
                            if (i >= 0) { break; }
                            setSolution(update(solution, {
                                actors: {
                                    $push: [{
                                        kind: "trap",
                                        position: hPos
                                    }]
                                }
                            }));
                            break;
                        }
                        case "remove": {
                            if (i < 0) { break; }
                            setSolution(update(solution, {
                                actors: { $splice: [[i, 1]] }
                            }));
                            break;
                        }
                    }
                }
            }} />
        {cursorTool.kind !== "none" &&
            <mesh ref={cursorRef} rotation={[0, -Math.PI / 3 * cursorDirection * (cursorTool.kind === "mirror" ? 0.51: 1), 0]}>
                <sphereGeometry args={[0.3]} />
                <meshPhongMaterial
                    transparent
                    opacity={0.5}
                    color={cursorTool.kind === "remove" ? "red" : "white"} />
                {(cursorTool.kind === "mirror" || cursorTool.kind === "spawner") &&
                        <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                            <meshPhongMaterial
                                transparent
                                opacity={0.5}
                                color={"white"} />
                        </mesh>}
            </mesh>}
    </group>;
}
