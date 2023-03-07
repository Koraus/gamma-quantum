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


export function App() {
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
        }))}>
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
            <SolutionManagerPanel
                className={cx(css({
                    pointerEvents: "all",
                    width: "fit-content",
                    marginTop: "5px",
                    position: "absolute",
                    zIndex: 50,
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

    </div>;
}