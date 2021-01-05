import React, { Fragment } from "react";
import { connect } from "react-redux";
import { SIO_RECEIVE_DRAWN_TILE, SIO_UPDATE_GAME_ID } from "../redux/actions";

const SocketContainer = (props) => {
  const { socket, receiveDrawnTile, updateGameID } = props;

  socket.on("starting-game", (gameID) => {
    // console.log(`starting-game recieved with ${gameID}`);
    socket.emit("starting-game-response", gameID);
    updateGameID(gameID);
  });

  socket.on("send-tiles", (tiles) => {
    receiveDrawnTile(tiles);
  });

  return <Fragment>{props.children}</Fragment>;
};

const mapStateToProps = (state, ownProps) => {
  return {};
};
const mapDispatchToProps = {
  updateGameID: (gameID) => ({ type: SIO_UPDATE_GAME_ID, payload: gameID }),
  receiveDrawnTile: (tiles) => ({
    type: SIO_RECEIVE_DRAWN_TILE,
    payload: tiles,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketContainer);
