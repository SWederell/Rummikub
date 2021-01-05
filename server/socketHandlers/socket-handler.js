const tiles = require("../tiles.json");
const { v4: uuidv4 } = require("uuid");

const shuffleTiles = (gameID) => {
  let unshuffledTiles = tiles.tiles;
  let shuffledTiles = [];
  for (let i = 105; i >= 0; i--) {
    shuffledTiles.push(
      unshuffledTiles.splice(Math.round(Math.random() * i), 1)[0]
    );
  }
  tileBags[gameID] = shuffledTiles;
};

const generateNewGame = (privateGame) => {
  let uuid = uuidv4();

  shuffleTiles(uuid);

  let newGame = {
    fieldDisplayOrder: ["field-empty"],
    fieldTileGroups: {
      "field-empty": {
        id: "field-empty",
        type: "field",
        tiles: [{ id: "empty" }],
      },
    },
    gameStarted: false,
    gameID: uuid,
    initialDrawComplete: false,
    maxPlayers: 4,
    players: [],
    playersTurn: false,
    private: privateGame,
    turn: 0,
  };

  games[uuid] = newGame;
  if (!privateGame) {
    gameList.push({
      gameID: newGame.gameID,
      players: newGame.players,
      maxPlayers: newGame.maxPlayers,
      started: false,
    });
  }

  return uuid;
};

const findIndex = (array, find) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].gameID === find) {
      return i;
    }
  }
};

let games = {};
let gameList = [];
let users = {};
let tileBags = {};

module.exports = (socket, io) => {
  users[socket.id] = { name: socket.id, currentGame: null };

  socket.join("lobby", () => {
    console.log(`Socket: ${socket.id} joined the lobby`);
    socket.emit("resetGameID");
    socket.emit("gameList", gameList);
  });

  socket.on("disconnect", () => {
    let gameID = users[socket.id].currentGame;

    if (gameID) {
      const index = games[gameID].players.indexOf(socket.id);
      if (index > -1) {
        games[gameID].players.splice(index, 1);
      }
      delete users[socket.id];

      socket.to(gameID).emit("updateClientState", games[gameID]);
    }

    socket.to("lobby").emit("gameList", gameList);
    console.log(`${socket.id} disconnected`);
  });

  socket.on("createGame", (privateGame) => {
    let gameID = generateNewGame(privateGame);
    socket.emit("joinNewGame", gameID);
  });

  socket.on("refreshGameList", () => {
    socket.emit("gameList", gameList);
  });

  socket.on("joinedGame", (gameID) => {
    // console.log(`joinedGame called with GameID: ${gameID}`);
    socket.leave("lobby", () => {
      console.log(`Socket: ${socket.id} left the lobby`);
      socket.join(gameID, () => {
        console.log(`Socket: ${socket.id} joined the game ${gameID}`);
        users[socket.id].currentGame = gameID;
        games[gameID].players.push(socket.id);
        socket.to("lobby").emit("gameList", gameList);
        socket.to(gameID).emit("updateClientState", games[gameID]);
        socket.emit("updateClientState", games[gameID]);
      });
    });
  });

  socket.on("gameStart", (gameID) => {
    // console.dir(games[gameID]);
    games[gameID].gameStarted = true;
    let index = findIndex(gameList, gameID);
    // console.log(index);
    gameList[index].started = true;
    socket.to("lobby").emit("gameList", gameList);
    // console.dir(games[gameID]);
    socket.to(gameID).emit("updateClientState", games[gameID]);
    socket.emit("updateClientState", games[gameID]);
  });

  socket.on("draw-tile", (payload) => {
    let { number, gameID, groups = 1 } = payload;
    console.log({ number, gameID, groups });

    if (number > tileBags[gameID].length) {
      number = tileBags[gameID].length;
    }

    while (tileBags[gameID][0] === undefined || tileBags[gameID][0] === null) {
      shuffleTiles(gameID);
    }

    let ret = [];
    for (let numberOfGroups = groups; numberOfGroups > 0; numberOfGroups--) {
      let tiles = [];
      for (let numberInGroup = 0; numberInGroup < number; numberInGroup++) {
        let tile = tileBags[gameID].shift();
        tiles.push(tile);
      }
      ret.push(tiles);
    }
    console.log(`sending tiles to ${socket.id}`);
    console.dir(ret);
    socket.emit("send-tiles", ret);
  });
};
