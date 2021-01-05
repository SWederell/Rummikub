import React from "react";
import TileGroup from "./TileGroup";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

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

const GameField = ({ fieldDisplayOrder, fieldTileGroups }) => {
  return (
    <Droppable droppableId="field" direction="horizontal" type="group">
      {(provided) => (
        <Container {...provided.droppableProps} ref={provided.innerRef}>
          {fieldDisplayOrder.map((tileGroup, index) => {
            return (
              <TileGroup
                group={fieldTileGroups[tileGroup]}
                key={fieldTileGroups[tileGroup].id}
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

export default GameField;
