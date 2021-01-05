import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

import SocketContainer from "./containers/SocketContainer";

import io from "socket.io-client";

const socket = io("http://127.0.0.1:4001");

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <SocketContainer socket={socket}>
        <App socket={socket} />
      </SocketContainer>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
