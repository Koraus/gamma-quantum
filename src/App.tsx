import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./scene/MainScene";
import { ReactionSandboxPanel } from "./ReactionSandboxPanel";
import { SolutionManagerPanel } from "./solutionManager/SolutionManagerPanel";
import { CursorToolSelectorPanel } from "./CursorToolSelectorPanel";
import { WorldInfoPanel } from "./WorldInfoPanel";
import { WinPanel } from "./WinPanel";
import { StatsPanel } from "./stats/StatsPanel";
import { useEffect, useState } from "react";


export function App() {
    const [isSolutionManagerShown, setIsSolutionManagerShown] =
        useState(false);

    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.code === "KeyM") {
                setIsSolutionManagerShown(!isSolutionManagerShown);
            }
        };
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    });

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
            <Canvas><MainScene /></Canvas>
        </div>
        <div className={cx(css({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            flex: "row",
        }))}>
            <div
                className={cx(css({
                    flex: "1 1 0",
                    position: "relative",
                }))}
            >
                <StatsPanel />
                <WinPanel />
                <WorldInfoPanel
                    className={cx(css({
                        pointerEvents: "all",
                    }))} />
                <ReactionSandboxPanel
                    className={cx(css({
                        pointerEvents: "all",
                    }))} />
                <CursorToolSelectorPanel
                    className={cx(css({
                        pointerEvents: "all",
                        position: "absolute",
                        bottom: "12vmin",
                        left: "1vmin",
                    }))}
                />
                <PlaybackPanel
                    className={cx(css({
                        pointerEvents: "all",
                        position: "absolute",
                        bottom: 0,
                    }))}
                    defalutPlaytimeSpeed={5}
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
                    <span className={css({ fontSize: "0.8em" })}>
                        {appVersion.split("+")[1]}
                    </span>
                </div>
            </div>

            <button
                css={{
                    padding: 0,
                    pointerEvents: "all",
                }}
                onClick={() =>
                    setIsSolutionManagerShown(!isSolutionManagerShown)}
            >
                <span css={{
                    display: "inline-block",
                    transitionDuration: "0.2s",
                    transform: isSolutionManagerShown
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                }}>&gt;</span>
                <br />M
            </button>
            <SolutionManagerPanel css={{
                pointerEvents: "all",
                transitionDuration: "0.2s",
                flex: isSolutionManagerShown
                    ? "0 0 33vmin"
                    : "0 0 0vmin",
                maxWidth: isSolutionManagerShown
                    ? "33vmin"
                    : "0vmin",
                margin: isSolutionManagerShown
                    ? "1px 1px"
                    : "1px -0.5px",
            }} />
        </div>

    </div>;
}