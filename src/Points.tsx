import React from "react";
import type { Action, Point as TPoint, State } from "./default.type";
import { Point } from "./Point";

export const Points = React.memo(function PointsLayer(props: {
  gameId: number;
  points: TPoint[];
  nextId: number;
  curPointIds: number[];
  dispatch: React.Dispatch<Action>;
  status: State["status"];
}) {
  const { points, nextId, curPointIds, dispatch, status, gameId } = props;
  return (
    <>
      {points.map((p) => (
        <Point
          key={`${p.id}-${gameId}`}
          point={p}
          nextId={nextId}
          curPointIds={curPointIds}
          dispatch={dispatch}
          status={status}
        />
      ))}
    </>
  );
});
