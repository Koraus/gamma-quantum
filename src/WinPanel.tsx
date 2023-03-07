import { css, cx } from "@emotion/css";
import { atom, useRecoilState } from "recoil";
import { useWorld } from "./useWorld";
import { useEffect } from "react";
import { isWin } from "./simulator";

export const winRecoil = atom({
    key: "win",
    default: false,
});

export function WinPanel() {
    const [win, setWin] = useRecoilState(winRecoil);

    const world = useWorld();
    useEffect(() => { if (!win && isWin(world)) { setWin(true); } });

    const problemProgress = () => {
        return Object.entries(world.problem.demand).map(
            ([key, val], i) => {
                if (Object.entries(world.consumed).length > 0) {
                    return Object.entries(world.consumed)
                        .map(([kC, vC], iC) => {
                            if (key === kC) {
                                return <div key={i}>{key} : {vC} / {val} </div>;
                            }
                        });
                } else return <div key={i}>{key} : 0 / {val} </div>;
            },
        );
    };
    return <> problemProgress :  {problemProgress()}
        {win && <div className={cx(
            css({
                fontWeight: "bold",
                fontSize: "16px",
                color: "green",
                width: "fit-content",
            }),
        )}>  'Win' </div>} </>;
}