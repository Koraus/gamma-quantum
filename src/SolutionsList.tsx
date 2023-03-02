import { css, cx } from "@emotion/css";
import * as solutions from "./hardcodedSoultions";
import { useState } from "react";
import { SolutionDraft } from "./puzzle/Solution";
import { StateProp } from "./utils/StateProp";
import * as problems from "./puzzle/problems";
import ProblemSolutionList from "./ProblemInSolutionList";

export function SolutionsList({
    solutionState: [solution, setSolution],
    className,
    ...props
}: {
    solutionState: StateProp<SolutionDraft>,
} & JSX.IntrinsicElements["div"]) {

    const [isShown, setIsShown] = useState(false);

    const listItems = Object.entries(solutions).map(([key, s]) => {
        return <li
            className={cx(
                css({
                    color: "white",
                    background: solution === s ? "#f34494" : "#a3119F",
                    margin: "0 0 10px 0",
                    cursor: "pointer",
                    width: "fit-content",
                }),
            )}
            onClick={() => setSolution(s)}
            key={key}
        > {key} </li>;
    });

    const currentSolutionKey = Object.entries(solutions)
        .find(([, s]) => s === solution)?.[0];

    return <div
        className={cx(
            css({
                background: "#000000b0",
                border: "1px solid #ffffffb0",
            }),
            className,
        )}
        {...props}
    >
        <div
            className={cx(
                css({
                    height: "100%",
                    width: "fit-content",
                    background: "#ff010Ab0",
                    textAlign: "center",
                    margin: "0 auto",
                    boxSizing: "border-box",
                    padding: "2px",
                    cursor: "pointer",
                }),
            )}
            onClick={() => setIsShown(!isShown)}
        >
            <span> Solutions: {currentSolutionKey ?? "*"} </span>
            <span
                className={cx(
                    css({
                        transform: isShown ? "rotate(-90deg)" : "rotate(90deg)",
                        display: "inline-block",
                        transitionDuration: "0.1s",
                        paddingRight: "1px",

                    }),
                )}
            > &gt; </span>
        </div>
        <div className={cx(
            css({
                display: isShown ? "block" : "none",
                margin: "2vmin",
            }),
        )}>
            <ul className={cx(
                css({
                    padding: 0,
                    listStyle: "none",
                }),
            )}
            >{listItems}</ul>
            <ProblemSolutionList
                problems={problems}
                solutions={solutions}
                solutionState={[solution, setSolution]} />
        </div>
    </div>;

}