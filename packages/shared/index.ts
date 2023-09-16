export function isObject(obj) {
  return Boolean(obj && typeof obj === "object");
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function hasChange(n, o) {
  return Object.is(n, o);
}

export function extend(target, sources) {
  return Object.assign({}, target, sources);
}

export function hasOwn(target, key) {
  return Object.hasOwnProperty.call(target, key);
}
