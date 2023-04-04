import { v2 } from "../../utils/v";
import * as hax from "../../utils/hax";
import { DirectionId, HalfDirectionId } from "../../puzzle/world/direction";
import { Solution, SolutionDraft, SolutionDraftDecoder, eqSolutionDraft } from "../../puzzle/terms/Solution";
import { Plane, Vector3 } from "three";
import { useRef } from "react";
import { pipe } from "fp-ts/lib/function";
import update from "immutability-helper";
import { cursorToolRecoil } from "../CursorToolSelectorPanel";
import { useRecoilValue, useRecoilState } from "recoil";
import { useSetSolution } from "../useSetSolution";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";
import { keyifyPosition } from "../../puzzle/terms/Position";
import { isLeft } from "fp-ts/Either";
import { ghostSolutionRecoil } from "./ghostSolutionRecoil";
import { Plane as DreiPlane } from "@react-three/drei";
import { GroupSync } from "../../utils/GroupSync";
import { useWindowEvent } from "../../utils/useWindowEvent";


const y0Plane = new Plane(new Vector3(0, 1, 0), 0);

export function InteractiveBoard() {
    const [cursorTool, setCursorTool] = useRecoilState(cursorToolRecoil);
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetSolution();

    const [ghostSolution, _setGhostSolution] =
        useRecoilState(ghostSolutionRecoil);
    const setGhostSolution = (s: SolutionDraft | Solution) => {
        if (isLeft(SolutionDraftDecoder.decode(s))) {
            _setGhostSolution(undefined);
            return;
        }

        if (ghostSolution && eqSolutionDraft(s, ghostSolution)) { return; }

        _setGhostSolution("solvedAtStep" in s
            ? update(s, { $unset: ["solvedAtStep"] })
            : s);
    };

    const applyGhost = () => {
        if (!ghostSolution) { return; }
        setSolution(ghostSolution);
    };

    const hPointer = useRef({
        position: v2.zero(),
        direction: 0,
    });

    const applyCursor = (hPos: v2, cursorDirection: number) => {
        if (cursorTool.kind === "none") { return; }
        const hPosKey = keyifyPosition(hPos);
        if (cursorTool.kind === "remove") {
            setGhostSolution(update(solution, {
                actors: { $unset: [hPosKey] },
            }));
            return;
        }

        const normalizedDirection =
            cursorDirection % 12
            + ((cursorDirection < 0) ? 12 : 0);

        setGhostSolution(update(solution, {
            actors: {
                [hPosKey]: {
                    $set: (() => {
                        switch (cursorTool.kind) {
                            case "spawner": return {
                                ...cursorTool,
                                direction:
                                    Math.floor((normalizedDirection) / 2) as
                                    DirectionId,
                            };
                            case "consumer": return {
                                ...cursorTool,
                            };
                            case "mirror": return {
                                ...cursorTool,
                                direction:
                                    normalizedDirection as HalfDirectionId,
                            };
                            case "trap": return {
                                ...cursorTool,
                            };
                        }
                    })(),
                },
            },
        }));
    };

    useWindowEvent("keydown", (e) => {
        if (e.code === "KeyR") {
            const step = (cursorTool.kind === "mirror" ? 1 : 2);
            hPointer.current.direction +=
                Math.sign((e.shiftKey ? (-1) : 1)) * step;
            applyCursor(
                hPointer.current.position,
                hPointer.current.direction);
        }
        if (e.code === "KeyQ") {
            const h = hPointer.current.position;
            const key = keyifyPosition(h);
            const tool = solution.actors[key];

            if (tool?.kind === "mirror") {
                setCursorTool({ kind: "mirror" });
            }
            if (tool?.kind === "spawner") {
                setCursorTool({
                    kind: "spawner",
                    output: tool.output,
                });
            }
            if (tool?.kind === "consumer") {
                setCursorTool({
                    kind: "consumer",
                    input: tool.input,
                });
            }
            if (tool?.kind === "trap") {
                setCursorTool({ kind: "trap" });
            }
            console.log("tool kind : " + tool?.kind);
         
        }
    });
    
    return <group>
        <DreiPlane
            args={[100, 100]}
            rotation={[-Math.PI / 2, 0, 0]}

            onPointerMove={ev => {
                hPointer.current.position = pipe(
                    ev.unprojectedPoint
                        .clone()
                        .addScaledVector(ev.ray.direction, ev.distance),
                    ({ x, z }) => [x, z] as v2,
                    hax.fromFlatCart,
                    hax.round,
                    ([x, y]) => [x, y] as v2,
                );
                applyCursor(
                    hPointer.current.position,
                    hPointer.current.direction);
            }}
            onWheel={(ev) => {
                if (!ev.shiftKey) { return; }
                const step = (cursorTool.kind === "mirror" ? 1 : 2);
                hPointer.current.direction += Math.sign(-ev.deltaY) * step;
                applyCursor(
                    hPointer.current.position,
                    hPointer.current.direction);
            }}
            onPointerUp={ev => {
                if (ev.button === 0) {
                    applyGhost();
                }
            }}
        >
            <meshBasicMaterial
                transparent
                opacity={0}
                alphaTest={1}

            />
        </DreiPlane>
        {cursorTool.kind !== "none" &&
            <GroupSync onFrame={(g, { raycaster, pointer, camera }) => {
                if (!g.parent) { return; }

                raycaster.setFromCamera(pointer, camera);
                raycaster.ray.intersectPlane(y0Plane, g.position);
                g.parent.worldToLocal(g.position);
            }}>
                <mesh>
                    <sphereGeometry args={[0.1]} />
                    <meshPhongMaterial
                        transparent
                        opacity={0.5}
                        color={cursorTool.kind === "remove"
                            ? "red"
                            : "white"
                        }
                    />
                </mesh>
            </GroupSync>
        }
    </group>;
}
