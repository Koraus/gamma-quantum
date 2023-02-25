import { css, cx } from "@emotion/css";

export function WinPanel({ win }: { win: Boolean }) {
    if (win) {
        return <div className={cx(
            css({
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'green',
                width: 'fit-content'
            }),
        )}>  'Win' </div>;
    }
    return <></>;

}
