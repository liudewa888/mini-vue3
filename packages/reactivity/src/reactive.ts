import { mutableHandlers } from "./baseHandlers";
import { isObject } from "../../shared/index";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw"
}

const proxyMap = new Map();
export function reactive(target) {
  if (!isObject(target)) return;
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  if (proxyMap.has(target)) {
    return proxyMap.get(target);
  }

  return createReactiveObject(target, false, mutableHandlers, proxyMap);
}

export function createReactiveObject(
  target,
  isReadonly,
  baseHandler,
  proxyMap
) {
  const proxy = new Proxy(target, baseHandler);
  proxyMap.set(target, proxy);
  return proxy;
}

export function isReactive(target) {
  return Boolean(target[ReactiveFlags.IS_REACTIVE]);
}
