import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";

import GameField from "./components/GameField";
import TileStand from "./components/TileStand";
import { NextIB, UndoIB, DrawIB, StartIB } from "./components/IconButtons";

import configureSocket from "./SocketController";
import { moveTilesAndGroups } from "./stateFunctions";

const initialState = {
  fieldDisplayOrder: ["field-empty"],
  fieldTileGroups: {
    "field-empty": {
      id: "field-empty",
      type: "field",
      tiles: [{ id: "empty" }],
    },
  },
  gameStarted: false,
  gameID: "",
  initialDrawComplete: false,
  maxPlayers: 4,
  players: [],
  playersTurn: false,
  previousStates: [],
  private: false,
  standDisplayOrder: ["stand-empty"],
  standTileGroups: {
    "stand-empty": {
      id: "stand-empty",
      type: "stand",
      tiles: [{ id: "empty" }],
    },
  },
  standToField: false,
  turn: 0,
};

const Container = styled.div`
  text-align: center;
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: max(calc(10px + 2vmin), 6px);
  font-family: Verdana, sans-serif;
  color: white;
  flex-direction: column;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IDContainer = styled.p`
  color: white;
`;

const App = ({ socket, gameID }) => {
  const [state, setState] = useState(() => {
    return initialState;
  });

  useEffect(() => {
    if (!socket) return;
    return configureSocket(socket, setState);
  }, [socket]);

  const _onDragEnd = (result) => {
    // console.log("onDragEnd called");
    if (state.gameStarted) {
      console.dir({ state, result });
      setState((prevState) => {
        let ret = moveTilesAndGroups(prevState, result);
        console.dir(ret);
        return ret;
      });
    }
  };

  const _endTurn = () => {
    socket.emit("end-turn");
  };

  const _drawTiles = (number = 1, groups = 1) => {
    socket.emit("draw-tile", {
      number: number,
      gameID: state.gameID,
      groups: groups,
    });
  };

  const _undoMove = () => {
    if (state.previousStates.length === 0) {
      return;
    } else {
      setState((prevState) => {
        return prevState.previousStates.pop();
      });
    }
  };

  const _startGame = () => {
    socket.emit("gameStart", state.gameID);
  };

  return (
    <DragDropContext onDragEnd={_onDragEnd}>
      <Container>
        <GameField
          fieldDisplayOrder={state.fieldDisplayOrder}
          fieldTileGroups={state.fieldTileGroups}
        />
        <ControlContainer>
          <UndoIB
            disabled={state.previousStates.length === 0}
            onClick={state.previousStates.length === 0 ? null : _undoMove}
          />

          <TileStand
            standDisplayOrder={state.standDisplayOrder}
            standTileGroups={state.standTileGroups}
          />

          {state.gameStarted ? (
            state.standToField === true ? (
              <NextIB disabled={false} onClick={_endTurn} />
            ) : (
              <DrawIB
                disabled={false}
                onClick={() =>
                  state.initialDrawComplete
                    ? _drawTiles(1, 1)
                    : _drawTiles(7, 2)
                }
                text={
                  state.initialDrawComplete ? "Draw & End Turn" : "Draw Tile"
                }
              />
            )
          ) : (
            <StartIB
              disabled={
                state.players.length > 1 && state.players[0] === socket.id
                  ? false
                  : true
              }
              onClick={
                state.players.length > 1 && state.players[0] === socket.id
                  ? _startGame
                  : null
              }
              text="Start Game"
            />
          )}
        </ControlContainer>
        <IDContainer>{`Socket: ${socket.id}, Game: ${gameID}`}</IDContainer>
      </Container>
    </DragDropContext>
  );
};

export default App;
