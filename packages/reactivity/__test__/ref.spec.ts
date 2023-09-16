import { effect } from "../src/effect";
import { ref } from "../src/ref";

describe("reactivity/ref", () => {
  it("should hold a value", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    const fn = jest.fn(() => {
      dummy = a.value;
    });

    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(dummy).toBe(2);
    // same value shoule not trigger
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
  });


  it.skip('shoulde make nested properties reactive',()=>{
    const a = ref({
      count: 1
    })

    let dummy
    effect(()=>{
      dummy = a.value.count
    })

    expect(dummy).toBe(1)
    a.value.count =2
    expect(dummy).toBe(2)
  })


  it('shoule work without initial value',()=>{
    const a = ref()
    let dummy
    effect(()=>{
      dummy = a.value
    })
    expect(dummy).toBe(undefined)
    a.value = 2
    expect(dummy).toBe(2)
  })

});
