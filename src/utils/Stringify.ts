import { Union } from "ts-toolbelt";


type StringifierError<T extends string> = { error: true } & T;

type StringifyObjectMember<T, K extends string & keyof T> =
    string extends K 
        ? `${string}`
        : `"${K}":${Stringify<T[K]>}`;
type StringifyObjectBody<T extends {}, Keys extends ReadonlyArray<keyof T>> = 
    Keys extends [infer Key, ...infer RestKeys] 
        ? Key extends string & keyof T
            ? [] extends RestKeys
                ? `${StringifyObjectMember<T, Key>}` // last key
                : RestKeys extends (keyof T)[]
                    ? `${StringifyObjectMember<T, Key>},${StringifyObjectBody<T, RestKeys>}` 
                    : StringifierError<"_StringifyObject: Unknown 0">
            : StringifierError<"_StringifyObject: Key is not string">
        : ""; // empty object
type StringifyObject<T extends {}> = `{${StringifyObjectBody<T, Union.ListOf<keyof T>>}}`;

// todo tuples
// todo arrays in some or any way

export type Stringify<T> =
    T extends string
        ? `"${T}"`
        : T extends number | boolean | null
            ? `${T}`
            : T extends {}
                ? StringifyObject<T>
                : StringifierError<"Stringify">;
