

export const sortKeys = <T extends object>(obj: T) => 
    (Object.keys(obj) as (keyof T)[])
        .reduce((acc, key) => (acc[key] = obj[key], acc), {} as T);
