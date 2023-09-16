class ReactiveEffect {
  public fn;
  public scheduler;
  public deps = [];
  constructor(fn, options: any = {}) {
    this.fn = fn;
    this.scheduler = options.scheduler;
  }
  run() {
    activeEffect = this;
    return this.fn();
  }
}
let activeEffect: any = null;
const targetMap = new WeakMap();

export function track(target, key) {
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }

  let deps = depMap.get(key);
  if (!deps) {
    deps = new Set();
    depMap.set(key, deps);
  }
  trackEffects(deps);
}
export function trackEffects(dep) {
  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key, newVal) {
  const depMap = targetMap.get(target);
  if (depMap) {
    const deps = depMap.get(key);
    triggerEffects(deps);
  }
}

export function triggerEffects(dep) {
  const effects = Array.isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    triggerEffect(effect);
  }
}

function triggerEffect(effect) {
  if (effect.scheduler) {
    effect.scheduler();
  } else {
    effect.run();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
