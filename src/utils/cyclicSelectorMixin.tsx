import { MouseEventHandler, Dispatch, SetStateAction } from "react";


export function cyclicSelectorMixin<T, Element>(
    values: readonly T[],
    [value, setValue]: [T, Dispatch<SetStateAction<T>>],
) {
    return {
        onMouseUp: (ev => {
            let i = values.indexOf(value);
            if (ev.button === 2) { i--; }
            else if (ev.button === 1) { i = 0; }
            else { i++; }

            setValue(values.at(i % values.length)!);

            ev.preventDefault();
        }) as MouseEventHandler<Element>,
        onMouseDown: (ev => ev.preventDefault()) as MouseEventHandler<Element>,
        onContextMenu: (ev => ev.preventDefault()) as MouseEventHandler<Element>,
    };
}
