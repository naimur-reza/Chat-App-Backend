const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const port = 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

let connectedUsers = [];
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://kothabol.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
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
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);

    // Remove the disconnected user from the array
    // connectedUsers = connectedUsers.filter((user) => user !== socket.id);
    connectedUsers.pop();
    io.emit("user_connected", connectedUsers);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

app.get("/", (req, res) => {
  res.send("server is running");
});
