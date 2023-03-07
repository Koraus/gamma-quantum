import { css, cx } from "@emotion/css";
import { atom, useRecoilState } from "recoil";
import { useWorld } from "./useWorld";
import { useEffect } from "react";
import { isWin } from "./simulator";
import { trustedEntries } from "./simulator";
export const winRecoil = atom({
    key: "win",
    default: false,
});

export function WinPanel() {
    const [win, setWin] = useRecoilState(winRecoil);

    const world = useWorld();
    useEffect(() => { if (!win && isWin(world)) { setWin(true); } });

    const problemProgress =
        trustedEntries(world.problem.demand).map(
            ([key, val], i) => {
                const vC = world.consumed[key] ?? 0;
                return <div key={i}>{key} : {vC} / {val} </div>;
            },
        );

    return <> Progress :  {problemProgress}
        {win && <div className={cx(
            css({
                fontWeight: "bold",
                fontSize: "16px",
                color: "green",
                width: "fit-content",
            }),
        )}>  'Win' </div>} </>;
}