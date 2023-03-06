import { css, cx } from "@emotion/css";
import { atom, useRecoilState } from "recoil";
import { useWorld } from "./useWorld";
import { useEffect } from "react";
import { isSolved } from "./puzzle/world";

export const winRecoil = atom({
    key: "win",
    default: false,
});

export function WinPanel() {
    const [win, setWin] = useRecoilState(winRecoil);

    const world = useWorld();
    useEffect(() => { if (!win && isSolved(world)) { setWin(true); }});

    if (!win) { return null; }
    return <div className={cx(
        css({
            fontWeight: "bold",
            fontSize: "16px",
            color: "green",
            width: "fit-content",
        }),
    )}>  'Win' </div>;
}
