const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
// const helmet = require("helmet");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cors = require("cors");

const tiles = require("./tiles.json");

const port = process.env.PORT || 4001;

const app = express();
// app.use(helmet());

app.use(cors());

app.use(express.static(path.join(__dirname, "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = http.createServer(app);

const io = socketIO(server);

server.listen(port, () => console.log(`Listening on port ${port}`));

const generateNewGameRoom = () => {
  // console.log("generateNewGame called");
  let unshuffledTiles = tiles.tiles;
  let shuffledTiles = [];

  for (let i = 105; i >= 0; i--) {
    let tile = unshuffledTiles.splice(Math.round(Math.random() * i), 1);
    shuffledTiles.push(tile[0]);
  }

  return {
    tileBag: shuffledTiles,
    users: [],
    gameState: {},
    turn: 0,
  };
};

const playersPerGame = 1;

let rooms = {
  waiting: {
    users: [],
  },
};
let users = {};

io.on("connection", (socket) => {
  socket.join("waiting", () => {
    console.log(`Socket ${socket.id} joined the waiting room`);
    rooms.waiting.users.push(socket.id);
    users[socket.id] = { id: socket.id };

    if (rooms.waiting.users.length === playersPerGame) {
      gameID = uuidv4();
      rooms[gameID] = generateNewGameRoom();
      for (let i = 0; i < playersPerGame; i++) {
        let user = rooms.waiting.users.shift();
        rooms[gameID].users.push(user);
        socket.emit("starting-game", gameID);
      }
      // console.log(rooms[gameID].users);
    }
  });

  socket.on("starting-game-response", (gameID) => {
    socket.leave("waiting", () => {
      console.log(`Socket ${socket.id} left the waiting room`);
    });
    socket.join(gameID, () => {
      socket.to(gameID).broadcast.emit("user-room-join", socket.id);
    });
  });

  socket.on("draw-tile", (payload) => {
    const { number, gameID } = payload;

    console.dir(rooms[gameID]);

    if (number > rooms[gameID].tileBag.length) {
      number = rooms[gameID].tileBag.length;
    }
    let tiles = [];
    for (let i = 0; i < number; i++) {
      let tile = rooms[gameID].tileBag.shift();
      tiles.push(tile);
    }
    socket.emit("send-tiles", tiles);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});
