


export function _throw(message: string, ctor = Error): never {
    throw new ctor(message);
}


