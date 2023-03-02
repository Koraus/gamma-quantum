import { css, cx } from "@emotion/css";
import { useState } from "react";
import { SolutionDraft } from "../puzzle/Solution";
import { StateProp } from "../utils/StateProp";
import * as problems from "../puzzle/problems";
import ProblemSolutionList from "./ProblemInSolutionList";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManagerRecoil";


export function SolutionsList({
    solutionState: [solution, setSolution],
    className,
    ...props
}: {
    solutionState: StateProp<SolutionDraft>,
} & JSX.IntrinsicElements["div"]) {
    const solutions = useRecoilValue(solutionManagerRecoil).savedSolutions;

    const problemsList = Object.entries(problems)
        .map(([problemName, problem]) => {

            return <ul className={cx(
                css({
                    padding: 0,
                    listStyle: "none",
                }),
            )}
            key={problemName} >

                {problemName}
                <ProblemSolutionList
                    problem={problem}
                    solutions={solutions}
                    solutionState={[solution, setSolution]} />
            </ul>;
        });

    const [isShown, setIsShown] = useState(false);

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
            {problemsList}
        </div>
    </div>;
}