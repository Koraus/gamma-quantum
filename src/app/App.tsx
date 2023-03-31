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
import { ReactionSandbox } from "../reactionSandbox/ReactionSandbox";
import { useGrabFocusFromBody } from "../utils/useGrabFocusFromBody";
import { useRecoilValue } from "recoil";
import { cellContentRecoil } from "./scene/cellContentRecoil";

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
    const cellContent = useRecoilValue(cellContentRecoil);
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
        <Canvas
            css={{ position: "absolute", inset: 0, zIndex: -1 }}
            gl={{
                physicallyCorrectLights: true,
            }}
            
        >
            <MainScene />
        </Canvas>
        <div css={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            flex: "row",
        }}>
            <div
                css={{
                    pointerEvents: "all",
                    transitionDuration: "0.2s",
                    overflow: "hidden",
                    flex: isReactionSandboxShown
                        ? "0 0 70vmin"
                        : "0 0 0vmin",
                    margin: isReactionSandboxShown
                        ? "0px 1px 1px 0px"
                        : "1px 0.5px",
                    background: "#000000f0",
                    border: "1px solid #ffffffb0",
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
                <ReactionSandbox
                    cellContent={cellContent}
                    css={{
                        height: "100%",
                    }} />

            </div>
            <button
                css={{
                    padding: 0,
                    pointerEvents: "all",
                }}
                onClick={() =>
                    setIsReactionSandboxShown(!isReactionSandboxShown)}
            >
                ⇔
                <br />
                <span css={{
                    display: "inline-block",
                    transitionDuration: "0.2s",
                    transform: isReactionSandboxShown
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                }}>&#60;
                </span>
                <br />
                <span css={{ textDecoration: "underline" }}>L</span>
            </button>
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
                overflow: "hidden",
                flex: isSolutionManagerShown
                    ? "0 0 33vmin"
                    : "0 0 0vmin",
                margin: isSolutionManagerShown
                    ? "0px 1px 1px 0px"
                    : "1px 0.5px",
            }} />
        </div>

    </div >;
}