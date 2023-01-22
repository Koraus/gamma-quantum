import { css } from "@emotion/css";
import { useState } from "react";
import { ReactionSandbox } from "./reactionSandbox/ReactionSandbox";


export function ReactionSandboxPanel({
    ...props
}: {} & JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);
    return <div
        {...props}
    >
        <button onClick={() => setIsOpen(!isOpen)}>*⇔*</button>
        {isOpen && <div className={css({
            position: "fixed",
            inset: "5vmin",
            background: "#000000b0",
            border: "1px solid #ffffffb0",
            padding: "2vmin",
        })}>
            <ReactionSandbox />
        </div>}
    </div>;
}
