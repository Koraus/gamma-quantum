import { Union } from "ts-toolbelt";


type StringifierError<T extends string> = { error: true } & T;

type StringifyObjectMember<T, K extends string & keyof T> =
    string extends K 
        ? `${string}`
        : `"${K}":${Stringify<T[K]>}`;
type StringifyObjectBody<T extends object, Keys extends ReadonlyArray<keyof T>> = 
    Keys extends [infer Key, ...infer RestKeys] 
        ? Key extends string & keyof T
            ? [] extends RestKeys
                ? `${StringifyObjectMember<T, Key>}` // last key
                : RestKeys extends (keyof T)[]
                    ? `${StringifyObjectMember<T, Key>},${StringifyObjectBody<T, RestKeys>}` 
                    : StringifierError<"StringifyObjectBody: Unknown 0">
            : StringifierError<"StringifyObjectBody: Key is not string">
        : ""; // empty object
type StringifyObject<T extends object> = `{${StringifyObjectBody<T, Union.ListOf<keyof T>>}}`;

// todo tuples
// todo arrays in some or any way
type StringifyArray<Element> = 
    "[]" | `[${Stringify<Element>}]` | `[${Stringify<Element>},${string}${Stringify<Element>}]`;

    
export type Stringify<T> =
    T extends string
        ? `"${T}"`
        : T extends number | boolean | null
            ? `${T}`
            : T extends (infer Element)[] 
                ? StringifyArray<Element>
                : T extends object
                    ? StringifyObject<T>
                    : StringifierError<"Stringify: Type not supported">;
