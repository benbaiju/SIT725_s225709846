const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

let onlineUsers = 0;
let nextUserId = 1;

io.on("connection", (socket) => {
  onlineUsers += 1;
  const userId = nextUserId;
  nextUserId += 1;

  io.emit("system message", {
    text: `User ${userId} connected. Online users: ${onlineUsers}`,
    timestamp: new Date().toISOString()
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      sender: `User ${userId}`,
      text: msg,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    onlineUsers -= 1;

    io.emit("system message", {
      text: `User ${userId} disconnected. Online users: ${onlineUsers}`,
      timestamp: new Date().toISOString()
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
