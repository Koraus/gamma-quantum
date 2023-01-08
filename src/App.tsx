import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useRef, useState } from "react";
import { PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { IntRange_0Inc_5Inc, Particle } from "./puzzle/terms";
import { initialWorld, stepInPlace } from "./puzzle/stepInPlace";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./MainScene";


// put 5 exchangers, make them spawn
// design a level based on simple spawns and reactions
// let user put spawners
// make a level based on simple spawns and reactions
// display hex grid

export function App() {
    const stepState = useState(0);
    const [step] = stepState;

    const world = initialWorld();
    for (let i = 0; i < step; i++) {
        stepInPlace({
            problem: undefined,
            actors: [],
        }, world);
    }



    return <div className={cx(
        css`& {
            display: flex;
            position: fixed;
            inset: 0;
            overflow: auto;
            color: white;
            font-family: monospace;
        }
        `,
    )}>
        <div className={cx(css({
            position: "absolute",
            inset: 0,
            zIndex: -1,
        }))}><Canvas><MainScene world={world} /></Canvas></div>
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
