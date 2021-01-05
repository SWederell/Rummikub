const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");

const port = process.env.PORT || 4001;

const app = express();
app.use(helmet());
app.use(cors({ origin: "http://localhost" }));

app.get("/", (req, res) => {
  res.send(
    "This is the backend server for playing Rummikub, please use the frontend page to play"
  );
});

const server = http.createServer(app);

const io = socketIO(server, { cookie: false });
io.on("connection", (socket) => {
  require("./socketHandlers/socket-handler.js")(socket, io);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
