import { Stringify } from "./Stringify";


// export const keyify = <T>(x: T) => JSON.stringify(x) as Stringify<T>
export const createKeyify = <T>(project: (x: T) => T) => (x: T) => JSON.stringify(project(x)) as Stringify<T>;
