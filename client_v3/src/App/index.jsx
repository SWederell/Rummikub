import React, { Fragment, useEffect, useState } from "react";
import io from "socket.io-client";
import Game from "./Game";
import Chat from "./Chat";
import { Lobby } from "./Lobby";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [gameID, setGameID] = useState(null);

  useEffect(() => {
    setSocket(io("http://127.0.0.1:4001"));
  }, []);

  return (
    <Fragment>
      {gameID ? (
        <Fragment>
          {<Game socket={socket} gameID={gameID} />}
          {
            //<Chat socket={socket} />
          }
        </Fragment>
      ) : (
        <Lobby socket={socket} setGameID={setGameID} />
      )}
    </Fragment>
  );
};

export default App;
