import { css, cx } from "@emotion/css";
import { useEffect, useRef } from "react";
import { Stop } from "@emotion-icons/ionicons-solid/Stop";
import { Play } from "@emotion-icons/ionicons-solid/Play";
import { Pause } from "@emotion-icons/ionicons-solid/Pause";
import { PlaySkipBack } from "@emotion-icons/ionicons-solid/PlaySkipBack";
import { PlaySkipForward } from "@emotion-icons/ionicons-solid/PlaySkipForward";
import { PlayForward } from "@emotion-icons/ionicons-solid/PlayForward";
import { CaretBack } from "@emotion-icons/ionicons-solid/CaretBack";
import { atom, useRecoilState } from "recoil";
import { useWindowKeyDown } from "./utils/useWindowKeyDown";

export type PlayAction = {
    startRealtime: number;
    startPlaytime: number;
    playtimeSpeed: number;
}

export const playActionRecoil = atom<PlayAction>({
    key: "playAction",
    default: {
        startRealtime: 0,
        startPlaytime: 0,
        playtimeSpeed: 0,
    },
});

export const nowPlaytime = (
    { startRealtime, startPlaytime, playtimeSpeed }: PlayAction,
    nowRealtime = performance.now() / 1000,
) => Math.max(0, startPlaytime + playtimeSpeed * (nowRealtime - startRealtime));

const toFixedFloor = (x: number, digits: number) =>
    (Math.floor(x * 10 ** digits) / 10 ** digits).toFixed(digits);

export function PlaybackPanel({
    defalutPlaytimeSpeed = 1,
    className, ...props
}: {
    defalutPlaytimeSpeed?: number;
} & JSX.IntrinsicElements["div"]) {
    const [playAction, setPlayAction] = useRecoilState(playActionRecoil);

    const nowPlaytimeText = (playAction: PlayAction) => {
        const t = nowPlaytime(playAction);
        return toFixedFloor(t, 2).padStart(7, "\u00B7");
    };
    const stepRef = useRef<HTMLElement>(null);
    const rangeRef = useRef<HTMLInputElement>(null);
    const rangeFullRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (playAction.playtimeSpeed === 0) { return; }
        const stepEl = stepRef.current;
        if (!stepEl) { return; }
        const rangeEl = rangeRef.current;
        if (!rangeEl) { return; }
        const rangeFullEl = rangeFullRef.current;
        if (!rangeFullEl) { return; }

        const render = () => {
            stepEl.innerText = nowPlaytimeText(playAction);
            rangeEl.valueAsNumber =
                nowPlaytime(playAction) - Math.floor(nowPlaytime(playAction));
            rangeFullEl.max =
                (Math.max(30, Math.ceil(nowPlaytime(playAction) / 10 + 1) * 10))
                    .toString();
            rangeFullEl.valueAsNumber = nowPlaytime(playAction);
            handler = requestAnimationFrame(render);
        };
        let handler = requestAnimationFrame(render);
        return () => cancelAnimationFrame(handler);
    }, [playAction, stepRef.current, rangeRef.current, rangeFullRef]);


    useWindowKeyDown((e) => {
        if (e.shiftKey) {
            if (e.code === "Space") {
                setPlayAction({
                    startPlaytime: 0,
                    playtimeSpeed: 0,
                    startRealtime: performance.now() / 1000,
                });
            }
        } else if (e.code === "Space") {
            setPlayAction({
                startPlaytime: nowPlaytime(playAction),
                playtimeSpeed:
                    playAction.playtimeSpeed === defalutPlaytimeSpeed
                        ? 0
                        : defalutPlaytimeSpeed,
                startRealtime: performance.now() / 1000,
            });
        }
        if (e.code === "Period") {
            setPlayAction({
                startPlaytime: Math.floor(nowPlaytime(playAction)) + 1,
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            });
        }
        if (e.code === "Comma") {
            setPlayAction({
                startPlaytime:
                    Math.max(0, Math.floor(nowPlaytime(playAction)) - 1),
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            });
        }
    }, [playAction]);

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
        ><Stop /></button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: nowPlaytime(playAction),
                playtimeSpeed:
                    playAction.playtimeSpeed === -defalutPlaytimeSpeed
                        ? 0
                        : -defalutPlaytimeSpeed,
                startRealtime: performance.now() / 1000,
            })}
        >
            {playAction.playtimeSpeed === -defalutPlaytimeSpeed
                ? <Pause />
                : <CaretBack />}
        </button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime:
                    Math.max(0, Math.floor(nowPlaytime(playAction)) - 1),
                playtimeSpeed: 0,
                startRealtime: performance.now() / 1000,
            })}
        ><PlaySkipBack /></button>
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
        ><PlaySkipForward /></button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: nowPlaytime(playAction),
                playtimeSpeed:
                    playAction.playtimeSpeed === defalutPlaytimeSpeed
                        ? 0
                        : defalutPlaytimeSpeed,
                startRealtime: performance.now() / 1000,
            })}
        >
            {playAction.playtimeSpeed === defalutPlaytimeSpeed
                ? <Pause />
                : <Play />}
        </button>
        <button
            className={cx(css({
                width: "30px",
                padding: "0px",
            }))}
            onClick={() => setPlayAction({
                startPlaytime: nowPlaytime(playAction),
                playtimeSpeed:
                    playAction.playtimeSpeed === 2 * defalutPlaytimeSpeed
                        ? 0
                        : (2 * defalutPlaytimeSpeed),
                startRealtime: performance.now() / 1000,
            })}
        >
            {playAction.playtimeSpeed === 2 * defalutPlaytimeSpeed
                ? <Pause />
                : <PlayForward />}
        </button>
        <input
            ref={rangeRef}
            type="range"
            min={0}
            max={0.9999}
            step={0.001}
            value={nowPlaytime(playAction) % 1}
            onChange={ev => setPlayAction({
                startPlaytime:
                    Math.floor(nowPlaytime(playAction))
                    + ev.target.valueAsNumber,
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
