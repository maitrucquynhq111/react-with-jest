import { useCounter } from "~/hooks/useCounter";
import { renderHook, act } from "@testing-library/react";

describe("useCounter()", () => {
  it("Khởi tạo với giá trị mặc định", async () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("Khởi tạo với giá trị mặc định custom", async () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("Tăng giá trị với hàm increment()", async () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("Giá giá trị với hàm decrement() mà không bị âm", async () => {
    const { result } = renderHook(() => useCounter(1));

    act(() => {
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });
  it("Reset giá trị với hàm reset()", async () => {
    const { result } = renderHook(() => useCounter(2));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(2);
  });
});
