

export const sortKeys = <T extends {}>(obj: T) => 
    Object.keys(obj).reduce((acc, key) => (acc[key] = (obj as any)[key], acc), {} as any) as T;
