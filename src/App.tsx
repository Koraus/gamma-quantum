import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useEffect, useState } from "react";
import { nowPlaytime, PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { init as _init, step as _step } from "./puzzle/step";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./MainScene";
import { ReactionSandboxPanel } from "./ReactionSandboxPanel";
import { getWorldAtPlaytime } from "./simulator";
import { fourSpawnersParallel as defaultSolution } from "./hardcodedSoultions";
import { SolutionsList } from "./SolutionsList"
import { Solution } from "./puzzle/terms";
import { CursorTool, CursorToolSelectorPanel } from "./CursorToolSelectorPanel";


// todo list:
// make a level based on simple spawns and reactions


export function App() {

    const [solution, setSolution] = useState(defaultSolution);

    const stepState = useState(0);
    const [step, setStep] = stepState;
    const world = getWorldAtPlaytime(solution, step);

    const cursorToolState = useState({ kind: "none" } as CursorTool);


    const playActionState = useState({
        startRealtime: 0,
        startPlaytime: 0,
        playtimeSpeed: 0,
    });
    const [playAction, setPlayAction] = playActionState;

    const setSolutionAndResetPlayback = (nextSolution: Solution | ((prevSolution: Solution) => Solution)) => {
        setSolution(nextSolution);
        setPlayAction({
            playtimeSpeed: 0,
            startPlaytime: 0,
            startRealtime: performance.now(),
        });
        cursorToolState[1]({ kind: "none" });
    }

    useEffect(() => {
        const handler = setInterval(() => {
            const stepNow = Math.floor(nowPlaytime(playActionState[0]));
            if (stepNow === step) { return; }
            setStep(stepNow);
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
            <div>step: {JSON.stringify(world.step)}</div>
            <div>energy: {JSON.stringify(world.energy)}</div>
            <div>consumed: {Object.entries(world.consumed).map(([k, v], i) => {
                return <div key={i}><>= {v} x {k}</></div>;
            })}</div>
            <div>particles:
                {world.particles.map((p, i) => {
                    if (p.isRemoved) { return null; }
                    return <div key={i}>
                        = #{i}: {JSON.stringify(p)}
                    </div>;
                })}
            </div>
            <ReactionSandboxPanel
                className={cx(css({
                    pointerEvents: "all",
                }))}
            />
            <SolutionsList
                className={cx(css({
                    pointerEvents: "all",
                    width: 'fit-content',
                    marginTop: '5px',
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
                <span className={css({ fontSize: "0.8em", })}>{appVersion.split("+")[1]}</span>
            </div>
        </div>

    </div>
}
