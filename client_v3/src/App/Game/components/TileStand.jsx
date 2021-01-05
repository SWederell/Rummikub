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
  background-color: darkgreen;
  padding: 10px;
  height: 15vh;
  width: 70vw;
`;

const TileStand = ({ standDisplayOrder, standTileGroups }) => {
  return (
    <Droppable droppableId="stand" direction="horizontal" type="group">
      {(provided) => (
        <Container
          id="__rmk_tileStand_container"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {standDisplayOrder.map((tileGroup, index) => {
            return (
              <TileGroup
                group={standTileGroups[tileGroup]}
                key={standTileGroups[tileGroup].id}
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

export default TileStand;
