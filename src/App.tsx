import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useEffect, useState } from "react";
import { nowPlaytime, PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { World } from "./puzzle/step";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./MainScene";
import { ReactionSandboxPanel } from "./ReactionSandboxPanel";
import { getWorldAtPlaytime } from "./simulator";
import { SolutionsList } from "./SolutionsList";
import { SolutionDraft } from "./puzzle/Solution";
import { CursorTool, CursorToolSelectorPanel } from "./CursorToolSelectorPanel";
import { WorldInfoPanel } from "./WorldInfoPanel";
import { WinPanel } from "./WinPanel";
import { ParticleKindKey } from "./puzzle/Particle";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil, useSetCurrentSolution } from "./solutionManagerRecoil";

function isWin(world: World) {
    return Object.entries(world.problem.demand)
        .every(([key, count]) =>
            (world.consumed[key as ParticleKindKey] ?? 0) >= (count ?? Infinity));
}
export function App() {

    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetCurrentSolution();

    const stepState = useState(0);
    const [step, setStep] = stepState;
    const world = getWorldAtPlaytime(solution, step);

    const cursorToolState = useState({ kind: "none" } as CursorTool);


    const playActionState = useState({
        startRealtime: 0,
        startPlaytime: 0,
        playtimeSpeed: 0,
    });
    const [, setPlayAction] = playActionState;

    const [win, setWin] = useState(false);

    const setSolutionAndResetPlayback = (
        nextSolution: SolutionDraft
            | ((prevSolution: SolutionDraft) => SolutionDraft),
    ) => {
        const resolvedNextSolution =
            ("function" === typeof nextSolution)
                ? nextSolution(solution)
                : nextSolution;
        setSolution(resolvedNextSolution);
        setPlayAction({
            playtimeSpeed: 0,
            startPlaytime: 0,
            startRealtime: performance.now(),
        });
        setWin(false);
        cursorToolState[1]({ kind: "none" });
    };

    useEffect(() => {
        const handler = setInterval(() => {
            const stepNow = Math.floor(nowPlaytime(playActionState[0]));
            if (stepNow === step) { return; }
            setStep(stepNow);
            if (!win && isWin(getWorldAtPlaytime(solution, stepNow))) { setWin(true); }
        }, 10);
        return () => clearInterval(handler);
    }, [playActionState[0]]);


    return <div className={cx(
        css`& {
            display: flex;
            position: fixed;
            inset: 0;
            overflow: auto;
            font-family: monospace;
        }
        `,
    )}>


        <div className={cx(css({
            position: "absolute",
            inset: 0,
            zIndex: -1,
        }))}>
            <Canvas>
                <MainScene
                    cursorTool={cursorToolState[0]}
                    solutionState={[solution, setSolutionAndResetPlayback]}
                    world={world}
                    playAction={playActionState[0]}
                />
            </Canvas>
        </div>
        <div className={cx(css({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
        }))}>
            <WinPanel win={win} />
            <WorldInfoPanel
                className={cx(css({
                    pointerEvents: "all",
                }))}
                world={world} />
            <ReactionSandboxPanel
                className={cx(css({
                    pointerEvents: "all",
                }))} />
            <SolutionsList
                className={cx(css({
                    pointerEvents: "all",
                    width: "fit-content",
                    marginTop: "5px",
                }))}
                solutionState={[solution, setSolutionAndResetPlayback]} />

            <div
                className={cx(css({
                    pointerEvents: "all",
                    position: "absolute",
                    bottom: "12vmin",
                    left: "1vmin",
                }))}
            >
                <CursorToolSelectorPanel
                    solution={solution}
                    cursorToolState={cursorToolState}
                />
                <button
                    onClick={() => {
                        console.log(solution);
                        navigator.clipboard.writeText(JSON.stringify(solution, undefined, 4));
                    }}
                >
                    copy current solution into clipboard
                </button>
            </div>
            <PlaybackPanel
                className={cx(css({
                    pointerEvents: "all",
                    position: "absolute",
                    bottom: 0,
                }))}
                playActionState={playActionState}
                defalutPlaytimeSpeed={3}
            />
            <div
                className={cx(css({
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    textAlign: "right",
                    fontSize: "2vmin",
                    lineHeight: "90%",
                }))}
            >
                {appVersion.split("+")[0]}<br />
                <span className={css({ fontSize: "0.8em" })}>{appVersion.split("+")[1]}</span>
            </div>
        </div>

    </div>;
}