import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useState } from "react";
import { PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { Solution } from "./puzzle/terms";
import { initialWorld, stepInPlace } from "./puzzle/stepInPlace";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./MainScene";
import { ReactionSandboxPanel } from "./ReactionSandboxPanel";

// todo list:
// design a level based on simple spawns and reactions
// let user put spawners
// make a level based on simple spawns and reactions
// display hex grid

const solution: Solution = {
    problem: undefined,
    actors: [{
        kind: "spawner",
        direction: 0,
        output: { content: "red" },
        position: [3, -3],
    }, {
        kind: "spawner",
        direction: 5,
        output: { content: "green" },
        position: [-3, 3],
    }, {
        kind: "spawner",
        direction: 1,
        output: { content: ["green", "blue"] },
        position: [-5, 3],
    }, {
        kind: "spawner",
        direction: 3,
        output: { content: "gamma" },
        position: [-2, 7],
    }, {
        kind: "spawner",
        direction: 4,
        output: { content: ["red", "green", "blue"] },
        position: [5, -6],
    }],
}

export function App() {
    const stepState = useState(0);
    const [step] = stepState;

    const world = initialWorld();
    for (let i = 0; i < step; i++) {
        stepInPlace(solution, world);
    }



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
        }))}><Canvas><MainScene solution={solution} world={world} /></Canvas></div>
        <div className={cx(css({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
        }))}>
            <div>step: {JSON.stringify(world.step)}</div>
            <div>energy: {JSON.stringify(world.energy)}</div>
            <div>particles:
                {world.particles.map((p, i) => <div key={i}>
                    = {i}: {JSON.stringify(p)}
                </div>)}
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
                stepState={stepState}
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
