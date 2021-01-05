import React, { Fragment } from "react";
import uuid from "react-uuid";

const SocketContainer = ({ socket }) => {
  socket.on("starting-game", (gameID) => {
    console.log(`starting-game recieved with ${gameID}`);
    // socket.emit("starting-game-response", gameID);
    setGameID(gameID);
  });

  socket.on("send-tiles", (tiles) => {
    console.log("send tiles received");
    console.dir(tiles);
    // const newTileGroupId = `${uuid()}`;
    // let newTileGroup = { id: newTileGroupId, type: "stand", tiles: tiles };
    // const global = getGlobal();

    // setGlobal({
    //   ...global,
    //   gameTiles: { ...gameTiles, newTileGroupId: newTileGroup },
    //   standDisplayOrder: [...standDisplayOrder, newTileGroupId],
    // });

    // setGameTiles({ ...gameTiles, newTileGroupId: { ...newTileGroup } });
    // setStandDisplayOrder([...standDisplayOrder, newTileGroupId]);
    // console.dir(getGlobal());
  });

  return <Fragment>{props.children}</Fragment>;
};

export default SocketContainer;
