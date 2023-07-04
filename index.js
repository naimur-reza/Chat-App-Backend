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
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});
