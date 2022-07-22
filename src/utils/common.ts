export const objectToString = (target: object): string => {
  if (isObject(target)) return '{}'
  return JSON.stringify(target)
}

export const isObject = (target: object) => {
  return typeof target === 'object' && target !== null
}
