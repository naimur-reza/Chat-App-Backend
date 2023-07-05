const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const port = 5000;

app.use(cors());

const { Server } = require("socket.io");

let connectedUsers = [];
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`A new user connected ${socket.id}`);

  // Emit an event to inform all connected clients about the new user
  connectedUsers.push(socket.id);
  io.emit("user_connected", connectedUsers);

  socket.on("join_room", ({ room, author }) => {
    if (room && author) {
      socket.join(room);
      console.log(author);
      io.emit("joined_user", { joinedRoom: room, author: author });
    }
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
