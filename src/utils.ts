import type { Point } from "./default.type";

export const generatedPoints = (numPoints: number): Point[] => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = Math.floor(Math.random() * 90);
    const y = Math.floor(Math.random() * 90);
    points.push({ id: i + 1, x: `${x}%`, y: `${y}%` });
  }
  return points;
};
