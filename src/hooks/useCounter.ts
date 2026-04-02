import { useState } from "react";

export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(Math.max(0, count - 1));
  };

  const reset = () => {
    setCount(initialValue);
  };

  return { count, increment, decrement, reset };
};
