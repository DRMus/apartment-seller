import styled from "styled-components";
import Svg from "../shared/ui/Svg";
import { SvgContainer } from "./styles";
import { useEffect, useRef, useState } from "react";
import { lastArrayItem } from "../shared/utils/lastArrayItem";
import { InternPoints, Position } from "../shared/types/Polygon";
import { convertToPolygonPoints } from "../shared/utils/convertToPolygonPoints";
import { useMultiKeyPress } from "../shared/hooks/useMultiKeyPress";

enum Direction {
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL",
}

function App() {
  const pressedKeys = useMultiKeyPress(window);

  const [Aparts, setAparts] = useState<string[]>([]);
  const [internPoints, setInternPoints] = useState<InternPoints>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>(Direction.VERTICAL);

  const rootContainerRef = useRef<HTMLDivElement>(null);
  const viewLineRef = useRef<SVGLineElement>(null);

  const clearDrawingPoints = () => {
    setInternPoints([]);
    setIsDrawing(false);
  };

  const changeDirection = () => {
    setDirection((prev) =>
      prev === Direction.HORIZONTAL ? Direction.VERTICAL : Direction.HORIZONTAL
    );
  };

  const getPosition = (
    clientX: number,
    clientY: number
  ): Position | undefined => {
    if (!rootContainerRef.current) return undefined;

    const prevPoint = lastArrayItem(internPoints);

    let x = clientX - rootContainerRef.current.offsetLeft;
    let y = clientY - rootContainerRef.current.offsetTop;

    if (direction === Direction.VERTICAL && prevPoint) {
      x = prevPoint[0];
    }

    if (direction === Direction.HORIZONTAL && prevPoint) {
      y = prevPoint[1];
    }
    
    return [x, y];
  };

  const setPolygonPoint = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    !isDrawing && setIsDrawing(true);

    const newPoint = getPosition(e.clientX, e.clientY);
    if (!newPoint) return;

    changeDirection();
    setInternPoints((prev) => [...prev, newPoint]);
  };

  const viewNextLine = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDrawing || !viewLineRef.current) return;

    const prevPoint = lastArrayItem(internPoints);
    const lineTo = getPosition(e.clientX, e.clientY);

    if (!lineTo || !prevPoint) return;

    viewLineRef.current.setAttribute("x1", `${prevPoint[0]}`);
    viewLineRef.current.setAttribute("y1", `${prevPoint[1]}`);
    viewLineRef.current.setAttribute("x2", `${lineTo[0]}`);
    viewLineRef.current.setAttribute("y2", `${lineTo[1]}`);
  };

  const saveValue = () => {
    const newApartment = convertToPolygonPoints(internPoints);
    setAparts((prev) => [...prev, newApartment]);
    clearDrawingPoints();
  };

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      const { key } = e;

      switch (key) {
        case "Enter":
          saveValue();
          break;
        case "Escape":
          clearDrawingPoints();
          break;
        case "z":
          if (pressedKeys.current[0] !== "Control") return;

          const newPoints = [...internPoints];
          newPoints.pop();
          if (newPoints.length === 0) clearDrawingPoints();

          setInternPoints(newPoints);
          break;
        case "d":
          changeDirection();
          break;
      }
    };

    window.addEventListener("keydown", onKeyPress);

    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [internPoints]);

  return (
    <SvgContainer ref={rootContainerRef}>
      <RootSvg onClick={setPolygonPoint} onMouseMove={viewNextLine}>
        <Svg>
          {Aparts.map((item, key) => (
            <StyledPolygon key={key} points={item} />
          ))}

          {internPoints.map(([x, y], idx) => {
            if (idx + 1 >= internPoints.length) {
              return <circle key={idx} cx={x} cy={y} r={5} fill="green" />;
            }

            return (
              <g key={idx}>
                <circle cx={x} cy={y} r={5} fill="green" />
                <line
                  x1={x}
                  y1={y}
                  x2={internPoints[idx + 1][0]}
                  y2={internPoints[idx + 1][1]}
                  stroke="black"
                />
              </g>
            );
          })}

          {isDrawing && <line ref={viewLineRef} stroke="black" />}
        </Svg>
      </RootSvg>
    </SvgContainer>
  );
}

export default App;

const RootSvg = styled(Svg)`
  /* background-color: #eaeaea; */
  width: 100%;
  height: 100%;
`;

const StyledPolygon = styled.polygon`
  fill: transparent;
  stroke-width: 2px;
  stroke: gray;
  transition: fill 333ms;
  &:hover {
    fill: red;
  }
`;
