import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import "./index.css";
import App from "./App";
import SocketContainer from "./components/SocketContainer";

import addReactNDevTools from "reactn-devtools";

addReactNDevTools();

setGlobal({
  gameID: "",
  initialDrawComplete: false,
  gameStart: false,
  standToArea: false,
  tileGroups: {
    "stand-empty": {
      id: "stand-empty",
      type: "stand",
      tiles: [{ id: "empty" }],
    },
    "area-empty": {
      id: "area-empty",
      type: "area",
      tiles: [{ id: "empty" }],
    },
  },
  areaDisplayOrder: ["area-empty"],
  standDisplayOrder: ["stand-empty"],
  previousStates: [],
});

const socket = io("http://127.0.0.1:4001");

ReactDOM.render(
  <React.StrictMode>
    <SocketContainer socket={socket} />
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById("root")
);
