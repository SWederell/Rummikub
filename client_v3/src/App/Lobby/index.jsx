import React, { useState, useEffect } from "react";
import configureSocket from "./SocketController";

import GameListItem from "./components/GameListItem";

export const Lobby = ({ socket, setGameID }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (!socket) return;
    return configureSocket(socket, setGames, setGameID);
  }, [socket, setGameID]);

  const refreshGameList = () => {
    socket.emit("refreshGameList");
  };

  const createNewGame = (privateGame) => {
    socket.emit("createGame", privateGame);
  };

  const joinGame = (gameID) => {
    socket.emit("joinedGame", gameID);
    setGameID(gameID);
  };

  return (
    <div>
      <button onClick={refreshGameList}>Refresh Game list</button>
      <button onClick={() => createNewGame(false)}>Create Public Game</button>
      <button onClick={() => createNewGame(true)}>Create Private Game</button>
      {games.map((game) => {
        return (
          <GameListItem key={game.gameID} game={game} joinGame={joinGame} />
        );
      })}
    </div>
  );
};
