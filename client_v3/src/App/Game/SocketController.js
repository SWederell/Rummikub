import { HandleDrawnTiles, integrateServerUpdate } from "./stateFunctions";

const configureSocket = (socket, setState) => {
  socket.on("starting-game", (gameID) => {
    // console.log(`starting-game recieved with ${gameID}`);
    // socket.emit("starting-game-response", gameID);
    setState((prevState) => {
      return { ...prevState, gameID: gameID };
    });
  });

  socket.on("send-tiles", (tiles) => {
    // console.log("send tiles received");
    console.dir(tiles);

    setState((prevState) => {
      return HandleDrawnTiles(prevState, tiles);
    });
  });

  socket.on("updateClientState", (serverState) => {
    setState((prevState) => {
      const newState = integrateServerUpdate(prevState, serverState);
      // console.log(newState);
      return newState;
    });
  });

  return () => {
    socket.off("starting-game");
    socket.off("send-tiles");
    socket.off("updateClientState");
  };
};
export default configureSocket;
