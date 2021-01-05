import React from "react";
import GameArea from "./containers/GameArea";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import styled from "styled-components";

import { MOVE_TILE, UNDO_MOVE, START_TURN } from "./redux/actions";
import TileStand from "./containers/TileStand";

import undoSVG from "./images/undo.svg";
import { ReactComponent as NextSVG } from "./images/next.svg";
import drawSVG from "./images/plus.svg";

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

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 8vh;
  font-size: 2vh;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  userselect: "false";
`;

const ButtonText = styled.p`
  margin-top: 2px;
  margin-bottom: 2px;
`;

const App = (props) => {
  const {
    areaDisplayOrder,
    gameID,
    initialDrawComplete,
    moveTile,
    previousStates,
    socket,
    standDisplayOrder,
    standToArea,
    tileGroups,
    undoMove,
    state,
  } = props;

  const onDragEnd = (result) => {
    moveTile(result);
  };

  const _endTurn = () => {
    socket.emit("end-turn");
  };

  const _drawTiles = () => {
    if (initialDrawComplete) {
      socket.emit("draw-tile", { number: 1, gameID: gameID });
    } else socket.emit("draw-tile", { number: 14, gameID: gameID });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {
          <GameArea
            areaDisplayOrder={areaDisplayOrder}
            tileGroups={tileGroups}
          />
        }
        <ControlContainer>
          <ButtonContainer
            onClick={undoMove}
            disabled={previousStates.length === 0}
          >
            <img
              src={undoSVG}
              style={{ width: "100%", userSelect: "false" }}
              alt="undo move"
              draggable="false"
            />
            <ButtonText>Undo Move</ButtonText>
          </ButtonContainer>
          {
            <TileStand
              standDisplayOrder={standDisplayOrder}
              tileGroups={tileGroups}
            />
          }
          <ButtonContainer>
            {standToArea === true ? (
              <div onClick={_endTurn}>
                {
                  // <img
                  //   src={nextSVG}
                  //   style={{ width: "100%", userSelect: "false" }}
                  //   alt="end turn"
                  //   draggable="false"
                  // />
                }
                <NextSVG />
                <ButtonText style={{ width: "100%" }}>End Turn</ButtonText>
              </div>
            ) : (
              <div onClick={_drawTiles}>
                <img
                  src={drawSVG}
                  style={{ width: "100%", userSelect: "false" }}
                  alt="end turn"
                  draggable="false"
                />
                <ButtonText>
                  {initialDrawComplete ? "Draw & End Turn" : "Draw Tile"}
                </ButtonText>
              </div>
            )}
          </ButtonContainer>
        </ControlContainer>
      </Container>
    </DragDropContext>
  );
};

const mapStateToProps = (state, ownProps) => {
  const {
    areaDisplayOrder,
    standDisplayOrder,
    tileGroups,
    previousStates,
    standToArea,
    gameID,
    initialDrawComplete,
  } = state.tilesReducer;
  return {
    ...ownProps,
    areaDisplayOrder,
    standDisplayOrder,
    tileGroups,
    previousStates,
    standToArea,
    gameID,
    state,
    initialDrawComplete,
  };
};

const mapDispatchToProps = {
  moveTile: (result) => ({
    type: MOVE_TILE,
    payload: {
      result,
    },
  }),
  undoMove: () => ({ type: UNDO_MOVE }),
  startTurn: () => ({ type: START_TURN }),
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
