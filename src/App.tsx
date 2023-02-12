import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useEffect, useState } from "react";
import { nowPlaytime, PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { Solution } from "./puzzle/terms";
import { init as _init, step as _step } from "./puzzle/step";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./MainScene";
import { ReactionSandboxPanel } from "./ReactionSandboxPanel";
import { getWorldAtPlaytime } from "./simulator";

// todo list:
// let user put spawners
// make a level based on simple spawns and reactions

const solution: Solution = {
    problem: undefined,
    actors: [{
        kind: "spawner",
        direction: 5,
        output: { content: "red" },
        position: [-2, 2],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: "red" },
        position: [8, -3],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: "red" },
        position: [-2, 13],
    }, {
        kind: "spawner",
        direction: 2,
        output: { content: "red" },
        position: [8, 8],
    }, {
        kind: "consumer",
        direction: 2,
        input: { content: ["red", "red", "red", "red"] },
        position: [3, 5],
    }],
}

export function App() {
    const stepState = useState(0);
    const [step, setStep] = stepState;
    const world = getWorldAtPlaytime(solution, step);

    const playActionState = useState({
        startRealtime: 0,
        startPlaytime: 0,
        playtimeSpeed: 0,
    });

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
                    solution={solution}
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
