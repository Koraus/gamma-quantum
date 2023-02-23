import { css, cx } from "@emotion/css";
import { useEffect, useRef } from "react";
import { StopFill } from "@emotion-icons/bootstrap/StopFill";
import { PlayFill } from "@emotion-icons/bootstrap/PlayFill";
import { PauseFill } from "@emotion-icons/bootstrap/PauseFill";
import { SkipEndFill } from "@emotion-icons/bootstrap/SkipEndFill";
import { SkipStartFill } from "@emotion-icons/bootstrap/SkipStartFill";
import { StateProp } from "./utils/StateProp";

export type PlayAction = {
    startRealtime: number;
    startPlaytime: number;
    playtimeSpeed: number;
}

export const nowPlaytime = (
    { startRealtime, startPlaytime, playtimeSpeed }: PlayAction,
    nowRealtime = performance.now() / 1000,
) => startPlaytime + playtimeSpeed * (nowRealtime - startRealtime);

const toFixedFloor = (x: number, digits: number) =>
    (Math.floor(x * 10 ** digits) / 10 ** digits).toFixed(digits);

export function PlaybackPanel({
    playActionState: [playAction, setPlayAction],
    defalutPlaytimeSpeed = 1,
    className, ...props
}: {
    playActionState: StateProp<PlayAction>;
    defalutPlaytimeSpeed?: number;
} & JSX.IntrinsicElements["div"]) {

    const nowPlaytimeText = (playAction: PlayAction) => {
        const t = nowPlaytime(playAction);
        return toFixedFloor(t, 2).padStart(7, "\u00B7");
    };
    const stepRef = useRef<HTMLElement>(null);
    const rangeRef = useRef<HTMLInputElement>(null);
    const rangeFullRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (playAction.playtimeSpeed === 0) { return; }
        const stepEl = stepRef.current!;
        const rangeEl = rangeRef.current!;
        const rangeFullEl = rangeFullRef.current!;
        const render = () => {
            stepEl.innerText = nowPlaytimeText(playAction);
            rangeEl.valueAsNumber = nowPlaytime(playAction) - Math.floor(nowPlaytime(playAction));
            rangeFullEl.max = (Math.max(30, Math.ceil(nowPlaytime(playAction) / 10 + 1) * 10)).toString();
            rangeFullEl.valueAsNumber = nowPlaytime(playAction);
            handler = requestAnimationFrame(render);
        }
        let handler = requestAnimationFrame(render);
        return () => cancelAnimationFrame(handler);
    }, [playAction, stepRef.current, rangeRef.current, rangeFullRef]);


    return <div
        className={cx(
            css({
                width: "fit-content",
                height: "fit-content",
            }),
            className,
        )}
        {...props}
    >
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: 0,
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
        ><StopFill /></button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: Math.max(0, Math.floor(nowPlaytime(playAction)) - 1),
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
        ><SkipStartFill /></button>
        <span
            className={cx(css({
                verticalAlign: "bottom",
                fontSize: "26px",
                padding: "0px 7px",
                fontFamily: "monospace",
            }))}
            ref={stepRef}
        >{nowPlaytimeText(playAction)}</span>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: Math.floor(nowPlaytime(playAction)) + 1,
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
        ><SkipEndFill /></button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: nowPlaytime(playAction),
                playtimeSpeed: playAction.playtimeSpeed === 0 ? defalutPlaytimeSpeed : 0,
                startRealtime: performance.now() / 1000,
            })}
        >{playAction.playtimeSpeed === 0 ? <PlayFill /> : <PauseFill />}</button>

        <input
            ref={rangeRef}
            type="range"
            min={0}
            max={0.9999}
            step={0.001}
            value={nowPlaytime(playAction) - Math.floor(nowPlaytime(playAction))}
            onChange={ev => setPlayAction({
                startPlaytime: Math.floor(nowPlaytime(playAction)) + ev.target.valueAsNumber,
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
            className={css({
            })}
        />
        <br />
        <input
            ref={rangeFullRef}
            type="range"
            min={0}
            max={Math.max(30, Math.ceil(nowPlaytime(playAction) / 10 + 1) * 10)}
            step={0.001}
            value={nowPlaytime(playAction)}
            onChange={ev => setPlayAction({
                startPlaytime: ev.target.valueAsNumber,
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
            className={css({
                width: "100%",
            })}
        />
    </div>;
}
