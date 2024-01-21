const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const PORT = process.env.PORT;

const server = http.createServer(app);
const io = socketIO(server);

const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
  return res.send("HELL ITS WORKING");
});

io.on("connection", (socket) => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("sendMessage", {
      user: "Admin",
      message: `${users[socket.id]} has Joined`,
    });
    socket.emit("sendMessage", {
      user: "Admin",
      message: `Welcome To The Chat ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id,user }) => {
    io.emit("sendMessage", { user:user, message, id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("sendMessage", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is Working on http://localhost:${PORT} `);
});
