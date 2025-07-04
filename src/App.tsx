import React, { useEffect, useReducer, useState } from "react";
import type { State, Action, Point } from "./default.type";
import { Points } from "./Points";
import { generatedPoints } from "./utils";

// Initial State
const initialState: State = {
  time: 0.0,
  totalPoints: 5,
  points: [],
  nextId: 1,
  status: "idle",
  elapsed: 0,
  autoPlay: false,
  curPointIds: [],
  gameId: 0,
};

// Generate random point positions

// Reducer function
const reducer = (curState: State, action: Action): State => {
  const { type } = action;
  const { status, points, gameId, totalPoints, curPointIds, time, nextId } =
    curState || {};

  switch (type) {
    case "SET_TIME":
      return { ...curState, time: time + 0.1 };

    case "SET_TOTAL_POINTS":
      if (action.payload < 0) return curState;
      return { ...curState, totalPoints: action.payload };

    case "START_GAME":
      return {
        ...curState,
        status: "playing",
        time: 0,
        elapsed: 0,
        nextId: 1,
        curPointIds: [],
        points: action.payload,
        autoPlay: false,
        gameId: gameId + 1,
      };

    case "CLICK_POINT": {
      const { id } = action.payload;
      if (id !== nextId) {
        return { ...curState, status: "failed" };
      }

      const newCurIds = [...curPointIds, id];
      const newPoints = points.map((p) => {
        if (p.id === id) {
          return { ...p, clicked: true };
        }
        return p;
      });

      return {
        ...curState,
        curPointIds: newCurIds,
        nextId: nextId + 1,
        points: newPoints,
        // status: isCleared ? "cleared" : "playing",
      };
    }

    case "REMOVE_OLD_POINTS": {
      // const newCurIds = [...curPointIds, action.payload];
      const isCleared =
        curPointIds.length === totalPoints && points.length <= 1;

      return {
        ...curState,
        points: points.filter((p) => p.id !== action.payload),
        status: isCleared ? "cleared" : "playing",
      };
    }

    case "SET_STATUS":
      return {
        ...curState,
        status: action.payload,
      };

    case "SET_ELAPSED":
      return {
        ...curState,
        elapsed: action.payload,
      };

    case "TOGGLE_AUTOPLAY":
      return {
        ...curState,
        autoPlay: !curState.autoPlay,
      };

    default:
      console.log("unknown action", action);
      return curState;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    status,
    totalPoints,
    points,
    time,
    nextId,
    curPointIds,
    autoPlay,
    gameId,
  } = state;

  // Start/Restart game
  function handleClickStart() {
    const newPoints = generatedPoints(totalPoints);
    console.log(newPoints);
    dispatch({ type: "START_GAME", payload: newPoints });
  }

  // Timer
  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      dispatch({ type: "SET_TIME" });
    }, 100);
    return () => clearInterval(interval);
  }, [status]);

  // Auto Play
  useEffect(() => {
    if (!autoPlay || status !== "playing") return;

    const timer = setInterval(() => {
      const nextPoint = points.find((p) => p.id === nextId);
      if (nextPoint) {
        dispatch({ type: "CLICK_POINT", payload: { id: nextPoint.id } });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [autoPlay, status, nextId, points]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="border p-6 w-[60rem] bg-white">
        <h2 className="font-bold text-lg mb-2">LET'S PLAY</h2>

        {status === "failed" && (
          <h3 className="text-red-500 font-bold">GAME OVER</h3>
        )}
        {status === "cleared" && (
          <h3 className="text-green-600 font-bold">ALL CLEARED</h3>
        )}

        <div className="mb-2">
          <label className="font-semibold mr-2">Points:</label>
          <input
            type="text"
            value={totalPoints}
            onChange={(e) =>
              dispatch({ type: "SET_TOTAL_POINTS", payload: +e.target.value })
            }
            min={1}
            className="border px-2 py-1 w-16 text-center"
          />
        </div>

        <div className="mb-2">
          <span className="font-semibold mr-2">Time:</span>
          <span>{time.toFixed(1)}s</span>
        </div>

        <button
          onClick={handleClickStart}
          className="bg-gray-300 text-black px-4 py-1 mb-2 mr-2"
        >
          {status === "idle" ? "Start" : "Restart"}
        </button>

        <button
          // key={Date.now()}
          onClick={() => dispatch({ type: "TOGGLE_AUTOPLAY" })}
          className="bg-gray-300 text-black px-4 py-1 mb-4"
        >
          Auto Play {autoPlay ? "ON" : "OFF"}
        </button>

        <div className="relative w-full h-[23rem] border ">
          <Points
            gameId={gameId}
            points={points}
            nextId={nextId}
            curPointIds={curPointIds}
            dispatch={dispatch}
            status={status}
          />
          {/* {points.map((point) => {
            // if(autoPlay) return return (
            //   <Point
            //     point={point}
            //     nextId={nextId}
            //     curPointIds={curPointIds}
            //     dispatch={dispatch}
            //     status={status}
            //   />
            // );
            return (
              <Point
                key={point.id * +point.x.split("%")[0]}
                point={point}
                nextId={nextId}
                curPointIds={curPointIds}
                dispatch={dispatch}
                status={status}
              />
            );
          })} */}
        </div>
        {status === "playing" && curPointIds.length + 1 <= totalPoints && (
          <p className="">Next: {curPointIds.length + 1}</p>
        )}
      </div>
    </div>
  );
};

export default App;
