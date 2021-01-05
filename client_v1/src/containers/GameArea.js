import React from "react";
import TileGroup from "./TileGroup";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  background-color: white;
  padding: 10px;
  height: 60vh;
  width: 80vw;
  margin-bottom: 20px;
`;

const GameArea = (props) => {
  const { areaDisplayOrder, tileGroups } = props;
  // console.log({ areaDisplayOrder, tileGroups });
  return (
    <Droppable droppableId="gameArea" direction="horizontal" type="group">
      {(provided) => (
        <Container {...provided.droppableProps} ref={provided.innerRef}>
          {areaDisplayOrder.map((tileGroup, index) => {
            return (
              <TileGroup
                group={tileGroups[tileGroup]}
                key={tileGroups[tileGroup].id}
                index={index}
              />
            );
          })}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
};

export default GameArea;
