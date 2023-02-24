import { css, cx } from "@emotion/css";
import { StateProp } from "./utils/StateProp";

const cursorTools = ["none", "spawner", "consumer", "mirror", "remove"] as const;
export type CursorTool = typeof cursorTools[number];

export function CursorToolSelectorPanel({
    cursorToolState: [cursor, setCursor],
    className,
    ...props
}: {
    cursorToolState: StateProp<CursorTool>;
} & JSX.IntrinsicElements["div"]) {
    return <div
        className={cx(
            css({
            }),
            className
        )}
        {...props}
    >
        {cursorTools.map(c => <div key={c}>
            <label>
                <input
                    type="radio"
                    radioGroup="cursorTool"
                    value="none"
                    checked={cursor === c}
                    onChange={() => setCursor(c)} />
                {c}
            </label>
        </div>)}
    </div>;
}
