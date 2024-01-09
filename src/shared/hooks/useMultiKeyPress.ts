import { MutableRefObject, useEffect, useRef } from "react";

export function useMultiKeyPress(
  listenElement: HTMLElement | Window,
  preventDefault?: boolean
): MutableRefObject<string[]> {
  const pressedKeys = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: any) => {
      if (preventDefault) e.preventDefault();
      const { key, repeat } = e;
      if (repeat) return;
      pressedKeys.current.push(key);
    };

    const onKeyUp = (e: any) => {
      if (preventDefault) e.preventDefault();
      const { key } = e;
      pressedKeys.current = pressedKeys.current.filter((item) => item !== key);
    };

    listenElement.addEventListener("keydown", onKeyDown);
    listenElement.addEventListener("keyup", onKeyUp);

    return () => {
      listenElement.removeEventListener("keydown", onKeyDown);
      listenElement.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return pressedKeys;
}
