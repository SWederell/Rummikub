import React from "react";

const GameListItem = ({ game, joinGame }) => {
  const { gameID, players, maxPlayers, started } = game;

  return (
    <div>
      {gameID}
      <p>{`${players.length}/${maxPlayers}`}</p>
      {started || players.length >= maxPlayers ? null : (
        <button onClick={() => joinGame(gameID)}>Join Game</button>
      )}
    </div>
  );
};

export default GameListItem;
