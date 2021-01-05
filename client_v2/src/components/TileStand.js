import React, { useGlobal } from "reactn";
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

const TileStand = (props) => {
  const standDisplayOrder = useGlobal("standDisplayOrder")[0];
  const tileGroups = useGlobal("tileGroups")[0];

  return (
    <Droppable droppableId="tileStand" direction="horizontal" type="group">
      {(provided) => (
        <Container {...provided.droppableProps} ref={provided.innerRef}>
          {standDisplayOrder.map((tileGroup, index) => {
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

export default TileStand;
