import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { useState } from "react";
import { PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";

export function App() {
    const stepState = useState(0);
    const [step] = stepState;

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
        }))}>
            {step}
        </div>
        <div className={cx(css({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
        }))}>
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
