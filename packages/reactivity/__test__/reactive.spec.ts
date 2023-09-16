import { effect } from "../src/effect";
import { reactive } from "../src/reactive";

describe("reactivity/reactive", () => {
  it("Object", () => {
    const original = { foo: 1 };
    const observed: any = reactive(original);

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    observed.foo = 10;
    expect(observed.foo).toBe(10);
  });

  it("reactive进行reactive,返回其本身", () => {
    const original = { foo: 1 };
    const observed: any = reactive(original);
    const observed_two = reactive(observed);
    expect(observed_two).toBe(observed);
  });

  it("同一个object进行多次reactive,返回同一个reactive", () => {
    const original = { foo: 1 };
    const observed: any = reactive(original);
    const observed_two = reactive(original);
    expect(observed_two).toBe(observed);
  });

  it("响应式effect测试", () => {
    const original = { foo: 10 };
    const observed: any = reactive(original);
    let dummy;
    const fn = jest.fn(() => {
      dummy = observed.foo;
    });
    effect(fn);

    expect(dummy).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
    observed.foo = 111;
    expect(dummy).toBe(111);
  });

  it("测试数组", () => {
    const original = [1, 2, 3, 4, 5];
    const observed: any = reactive(original);
    let dummy;
    const fn = jest.fn(() => {
      dummy = observed.indexOf(2);
    });
    effect(fn);
    observed[1] = 22;
    expect(dummy).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
