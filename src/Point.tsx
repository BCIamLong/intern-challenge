import { useEffect, useState } from "react";
import type { Action, Point as TPoint } from "./default.type";

export const Point = function ({
  point,
  dispatch,
  curPointIds,
  status,
}: {
  point: TPoint;
  nextId: number;
  curPointIds: number[];
  dispatch: React.Dispatch<Action>;
  status: string;
}) {
  const [time, setTime] = useState(3.0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (status !== "playing" || !(isClicked || point.clicked)) return;

    if (time <= 0) {
      setTime(3.0);
      setIsClicked(false);
      dispatch({ type: "REMOVE_OLD_POINTS", payload: point.id });
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [time, status, point]);

  function handleClick() {
    if (status !== "playing") return;

    setIsClicked(true);
    setTimeout(() => {
      dispatch({ type: "CLICK_POINT", payload: { id: point.id } });
    }, 100);
  }
  // console.log(
  //   `bg-orange-500 opacity-[${(1 - Math.min((time * 1000) / 3000, 1)).toFixed(
  //     1
  //   )}]`
  // );

  // const fadeRatio = Math.min(1, time / 3); // clamp between 0 and 1
  const backgroundColor = `rgba(255, 165, 0, ${time / 3})`;

  return (
    <div
      onClick={handleClick}
      className={`absolute flex-col w-10 h-10 border-2  rounded-full flex items-center justify-center text-sm font-normal cursor-pointer transition-all duration-300  border-orange-700 text-gray-600  ${
        curPointIds.includes(point.id) ? "z-30" : "z-10"
      }`}
      style={{
        top: point.y,
        left: point.x,
        backgroundColor:
          point.clicked || isClicked ? backgroundColor : "transparent",
        // transition: "background-color 0.1s linear",
      }}
    >
      <p>{point.id}</p>
      {point.clicked && (
        <p className="text-xs font-normal">{time.toFixed(1)}s</p>
      )}
    </div>
  );
};
