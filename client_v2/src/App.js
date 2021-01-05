import React, { useGlobal } from "reactn";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";

import GameArea from "./components/GameArea";
import TileStand from "./components/TileStand";
import ImageButton from "./components/ImageButton";

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

const App = (props) => {
  const gameID = useGlobal("gameID")[0];
  const previousStates = useGlobal("previousStates")[0];
  const initialDrawComplete = useGlobal("initialDrawComplete")[0];
  const standToArea = useGlobal("standToArea")[0];

  const { socket, moveTile, undoMove } = props;

  const onDragEnd = (result) => {
    moveTile(result);
  };

  const _endTurn = () => {
    socket.emit("end-turn");
  };

  const _drawTiles = () => {
    // console.dir(getGlobal());
    // console.dir(socket);
    if (initialDrawComplete) {
      socket.emit("draw-tile", { number: 1, gameID: gameID });
    } else socket.emit("draw-tile", { number: 14, gameID: gameID });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <GameArea />
        <ControlContainer>
          <ImageButton
            disabled={previousStates.length === 0}
            onClick={undoMove}
            type="undo"
            text="Undo Move"
          />

          {<TileStand />}

          {standToArea === true ? (
            <ImageButton
              disabled={false}
              onClick={_endTurn}
              type="next"
              text="End Turn"
            />
          ) : (
            <ImageButton
              disabled={false}
              onClick={_drawTiles}
              type="draw"
              text={initialDrawComplete ? "Draw & End Turn" : "Draw Tile"}
            />
          )}
        </ControlContainer>
      </Container>
    </DragDropContext>
  );
};

const mapDispatchToProps = {
  moveTile: (result) => ({
    type: {},
    payload: {
      result,
    },
  }),
  undoMove: () => ({}),
  startTurn: () => ({}),
};

export default App;
