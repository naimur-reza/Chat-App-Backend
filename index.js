const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const port = 5000;
app.use(cors());
app.use(express.json());

const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A new user connected ${socket.id}`);
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
