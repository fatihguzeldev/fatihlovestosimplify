import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

const SOCKET_URL = "http://localhost:3000";

type Point = { x: number; y: number };
type DrawData = { start: Point; end: Point; color: string };

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [color, setColor] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPositionRef = useRef<Point | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("init", ({ color: assignedColor, state }) => {
      setColor(assignedColor);
      state.forEach((drawData: DrawData) => {
        drawLine(drawData);
      });
    });

    newSocket.on("draw", (drawData: DrawData) => {
      drawLine(drawData);
    });

    newSocket.on("clear", () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const drawLine = (drawData: DrawData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
    context.strokeStyle = drawData.color;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.moveTo(drawData.start.x, drawData.start.y);
    context.lineTo(drawData.end.x, drawData.end.y);
    context.stroke();
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    lastPositionRef.current = point;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !socket || !lastPositionRef.current) return;

    const newPoint = getCanvasPoint(e);
    const drawData: DrawData = {
      start: lastPositionRef.current,
      end: newPoint,
      color,
    };

    drawLine(drawData);
    socket.emit("draw", drawData);
    lastPositionRef.current = newPoint;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPositionRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    socket?.emit("clear");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Canvas Collaboration (Your Color: {color})</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <div>
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>
    </div>
  );
};

export default App;
