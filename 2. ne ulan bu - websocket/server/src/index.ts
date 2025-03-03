import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const COLORS = ["red", "blue", "green", "purple", "orange"];
let canvasState: any[] = [];
let colorIndex = 0;

io.on("connection", (socket) => {
  const color = COLORS[colorIndex++ % COLORS.length];

  // send initial state
  socket.emit("init", {
    state: canvasState,
    color,
  });

  // handle drawing
  socket.on("draw", (drawData) => {
    const drawWithColor = { ...drawData, color };
    canvasState.push(drawWithColor);
    socket.broadcast.emit("draw", drawWithColor);
  });

  // handle canvas clear
  socket.on("clear", () => {
    canvasState = [];
    io.emit("clear");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
