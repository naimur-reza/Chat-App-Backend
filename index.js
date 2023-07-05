const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const port = 5000;

app.use(cors());
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-client-sage.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A new user connected ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
    console.log(data);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

app.get("/", (req, res) => {
  res.send("server is running");
});
