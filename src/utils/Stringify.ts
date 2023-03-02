import { Union } from "ts-toolbelt";


type Error<T extends string> = { error: true } & T;

type ObjMember<T, K extends string & keyof T> =
    string extends K 
        ? `${string}`
        : `"${K}":${Stringify<T[K]>}`;
type ObjBody<
    T extends object, 
    Keys extends ReadonlyArray<keyof T>
> = Keys extends [infer Key, ...infer RestKeys] 
        ? Key extends string & keyof T
            ? [] extends RestKeys
                ? `${ObjMember<T, Key>}` // last key
                : RestKeys extends (keyof T)[]
                    ? `${ObjMember<T, Key>},${ObjBody<T, RestKeys>}` 
                    : Error<"StringifyObjectBody: Unknown 0">
            : Error<"StringifyObjectBody: Key is not string">
        : ""; // empty object
type Obj<T extends object> = 
    `{${ObjBody<T, Union.ListOf<keyof T>>}}`;

// todo tuples
type Arr<Element> = 
    "[]" 
    | `[${Stringify<Element>}]` 
    | `[${Stringify<Element>},${string}${Stringify<Element>}]`;

    
export type Stringify<T> =
    T extends string
        ? `"${T}"`
        : T extends number | boolean | null
            ? `${T}`
            : T extends (infer Element)[] 
                ? Arr<Element>
                : T extends object
                    ? Obj<T>
                    : Error<"Stringify: Type not supported">;
