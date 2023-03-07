
export const trustedKeys =
    <TRecord extends Partial<Record<keyof object, unknown>>>(obj: TRecord) =>
        Object.keys(obj) as (keyof TRecord)[];

export const trustedEntries =
    <TRecord extends Partial<Record<keyof object, unknown>>>(obj: TRecord) =>
        Object.entries(obj) as [
            keyof TRecord,
            NonNullable<TRecord[keyof TRecord]>
        ][];
