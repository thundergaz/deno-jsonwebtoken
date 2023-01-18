export const isString = (value: unknown): value is string => typeof value === 'string'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndefined = (value: unknown): value is undefined => typeof value === 'undefined'
