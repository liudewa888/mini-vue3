import { trackEffects,triggerEffects } from "./effect";

class RefImpl {
  private _rawValue
  private _value;
  private _shallow;
  constructor(raw, isShallow) {
    this._value = raw;
    this._shallow = isShallow;
  }
  get value() {
    // TODO track
    trackRefValue(this)
    return this._value;
  }
  set value(newVal) {
    // TODO trigger
    if(!Object.is(this._rawValue,newVal)){
      this._rawValue = newVal
      this._value = newVal;
      triggerRefValue(this,newVal)
    }
  }
}

export function trackRefValue(ref){
  if(!ref.dep){
    ref.dep = new Set()
  }
  trackEffects(ref.dep)
}

export function triggerRefValue(ref,newVal){
  triggerEffects(ref.dep)
}


function createRef(raw, isShallow = false) {
  return new RefImpl(raw, isShallow);
}

export function ref(raw) {
  return createRef(raw, false);
}
