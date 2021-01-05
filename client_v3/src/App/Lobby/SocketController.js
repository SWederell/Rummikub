const configureSocket = (socket, setGames, setGameID) => {
  socket.on("gameList", (gamelist) => {
    // console.log(`gameList received`);
    setGames(gamelist);
  });

  socket.on("resetGameID", () => {
    setGameID(null);
  });

  socket.on("joinNewGame", (gameID) => {
    setGameID(gameID);
    socket.emit("joinedGame", gameID);
  });

  return () => {
    socket.off("gameList");
    socket.off("resetGameID");
    socket.off("joinNewGame");
  };
};

export default configureSocket;
