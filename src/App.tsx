import "./initAnalytics";

import { css, cx } from "@emotion/css";
import { PlaybackPanel } from "./PlaybackPanel";
import { appVersion } from "./appVersion";
import { Canvas } from "@react-three/fiber";
import { MainScene } from "./scene/MainScene";
import { SolutionManagerPanel } from "./solutionManager/SolutionManagerPanel";
import { CursorToolSelectorPanel } from "./CursorToolSelectorPanel";
import { WorldInfoPanel } from "./WorldInfoPanel";
import { WinPanel } from "./WinPanel";
import { StatsPanel } from "./stats/StatsPanel";
import { useRef, useState } from "react";
import { ReactionSandbox } from "./reactionSandbox/ReactionSandbox";
import { useGrabFocusFromBody } from "./utils/useGrabFocusFromBody";

const focusMeOnce = (el: HTMLElement | null) => el?.focus();

export function App() {
    const [isSolutionManagerShown, setIsSolutionManagerShown] =
        useState(true);
    const [isReactionSandboxShown, setIsReactionSandboxShown] =
        useState(false);
    const [isWorldInfoShown, setIsWorldInfoShown] =
        useState(false);

    const focusRootRef = useRef<HTMLDivElement>(null);
    useGrabFocusFromBody(focusRootRef);

    return <div
        css={{
            display: "flex",
            position: "fixed",
            inset: "0",
            overflow: "auto",
            fontFamily: "monospace",
        }}
        ref={focusRootRef}
        tabIndex={-1}
        onKeyDown={ev => {
            // console.log(ev.code);
            if (ev.code === "KeyM") {
                setIsSolutionManagerShown(!isSolutionManagerShown);
                return;
            }
            if (ev.code === "KeyL") {
                setIsReactionSandboxShown(!isReactionSandboxShown);
                return;
            }
            if (ev.code === "Backquote") {
                setIsWorldInfoShown(!isWorldInfoShown);
                return;
            }
        }}
    >
        <Canvas css={{ position: "absolute", inset: 0, zIndex: -1 }}>
            <MainScene />
        </Canvas>
        <div css={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            flex: "row",
        }}>
            <div css={{
                flex: "1 1 0",
                position: "relative",
                margin: "1.5vmin",
            }}>
                <StatsPanel css={{
                    position: "absolute",
                    right: 0,
                    maxWidth: "60vmin",
                }} />

                <WinPanel css={{
                    position: "absolute",
                    right: 0,
                    top: "14vmin",
                    maxWidth: "30vmin",
                    textAlign: "right",
                }} />

                <button
                    css={{
                        pointerEvents: "all",
                    }}
                    onClick={() =>
                        setIsWorldInfoShown(!isWorldInfoShown)}
                >
                    Debug (<span css={{ textDecoration: "underline" }}>`</span>)
                </button>

                <br />

                {isWorldInfoShown
                    && <WorldInfoPanel
                        className={cx(css({
                            pointerEvents: "all",
                        }))} />}

                <button
                    css={{
                        pointerEvents: "all",
                    }}
                    onClick={() =>
                        setIsReactionSandboxShown(!isReactionSandboxShown)}
                >
                    * ⇔ *
                    (<span css={{ textDecoration: "underline" }}>L</span>)
                </button>

                <CursorToolSelectorPanel
                    className={cx(css({
                        pointerEvents: "all",
                        position: "absolute",
                        bottom: "12vmin",
                        left: "1vmin",
                    }))}
                />

                <PlaybackPanel
                    css={{
                        pointerEvents: "all",
                        position: "absolute",
                        bottom: 0,
                    }}
                    defalutPlaytimeSpeed={5}
                />

                <div css={{ // appVersion panel
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    textAlign: "right",
                    fontSize: "2vmin",
                    lineHeight: "90%",
                }}>
                    {appVersion.split("+")[0]}<br />
                    <span css={{ fontSize: "0.8em" }}>
                        {appVersion.split("+")[1]}
                    </span>
                </div>

                {isReactionSandboxShown && <div
                    css={{
                        pointerEvents: "all",
                        position: "absolute",
                        inset: "5vmin",
                        background: "#000000f0",
                        border: "1px solid #ffffffb0",
                        padding: "2vmin",
                        zIndex: 100,
                    }}
                    tabIndex={-1}
                    ref={focusMeOnce}
                    onKeyDown={ev => {
                        if (ev.code === "Escape") {
                            setIsReactionSandboxShown(false);
                            return;
                        }
                    }}
                >
                    <ReactionSandbox css={{
                        height: "100%",
                    }} />
                    <button
                        css={{
                            position: "absolute",
                            padding: "0px 3px 0px 3px",
                            top: "0",
                            right: "0",
                            background: "red",
                            color: "white",
                        }}
                        onClick={() => {
                            setIsReactionSandboxShown(false);
                        }}> X </button>
                </div>}

            </div>

            <button // toggle SolutionManagerPanel button
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
                <br /><span css={{ textDecoration: "underline" }}>M</span>
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
                    ? "0px 1px 1px 0px"
                    : "1px -0.5px",
            }} />
        </div>

    </div >;
}