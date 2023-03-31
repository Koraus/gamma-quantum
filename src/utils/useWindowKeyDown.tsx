import { DependencyList } from "react";
import { useWindowEvent } from "./useWindowEvent";

/** @deprecated Use useWindowEvent("keydown", ...) instead */
export function useWindowKeyDown(
    handler: (e: KeyboardEvent) => void,
    deps?: DependencyList,
) {
    useWindowEvent("keydown", handler, deps);
}
