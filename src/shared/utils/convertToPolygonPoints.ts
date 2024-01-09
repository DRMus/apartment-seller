import { InternPoints } from "../types/Polygon";

export function convertToPolygonPoints(points: InternPoints): string {
    return points.map((position) => position.join(",")).join(" ");
}