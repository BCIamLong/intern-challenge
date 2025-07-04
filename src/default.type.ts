export interface Point {
  id: number;
  x: string;
  y: string;
  clicked?: boolean;
}

export type State = {
  time: number;
  totalPoints: number;
  points: Point[];
  nextId: number;
  status: "idle" | "playing" | "failed" | "cleared";
  elapsed: number;
  autoPlay: boolean;
  curPointIds: number[];
  gameId: number;
};

export type Action =
  | { type: "SET_TIME" }
  | { type: "SET_TOTAL_POINTS"; payload: number }
  | { type: "START_GAME"; payload: Point[] }
  | { type: "CLICK_POINT"; payload: { id: number } }
  | { type: "REMOVE_OLD_POINTS"; payload: number }
  | { type: "SET_STATUS"; payload: State["status"] }
  | { type: "SET_ELAPSED"; payload: number }
  | { type: "TOGGLE_AUTOPLAY" };
