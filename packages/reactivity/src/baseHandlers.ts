import { hasOwn, isArray } from "../../shared/index";
import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

export function createGetter(isReadonly = false) {
  return function (target, key, reciver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      return target;
    }

    const targetIsArray = isArray(target);

    if (!isReadonly && targetIsArray && hasOwn(arayInstrumentations, key)) {
      return Reflect.get(arayInstrumentations, key, reciver);
    }

    if (!isReadonly) {
      // TODO track
      track(target, key);
    }
    return Reflect.get(target, key, reciver);
  };
}

export function createSetter() {
  return function (target, key, newVal, reciver) {
    // TODO trigger
    const result = Reflect.set(target, key, newVal);
    trigger(target, key, newVal);
    return result;
  };
}

const arayInstrumentations = {};

["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  const method = Array.prototype[key];
  
  arayInstrumentations[key] = function (...args) {
    const arr: any = this;

    for (let i = 0; i < arr.length; i++) {
      track(arr, i + "");
    }

    const res = method.apply(arr, args);
    if (res === -1 || res === false) {
      return method.apply(arr, args);
    } else {
      return res;
    }
  };
});

const get = createGetter();
const set = createSetter();

export const mutableHandlers = {
  get,
  set,
};
