import React from "react";
import Tile from "../components/Tile";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-contents: center:
  margin-right: 10px;
`;

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-right: 5px;
`;

const Handle = styled.div`
  display: ${(props) => (props.isDragDisabled ? "none" : "block")};
  width: 90%;
  height: 2px;
  margin: 5px auto;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

const TileGroup = (props) => {
  const { group, index } = props;
  const { tiles, id } = group;
  // console.log({ group });
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <OuterContainer {...provided.draggableProps} ref={provided.innerRef}>
          <Droppable droppableId={id} direction="horizontal" type="tile">
            {(provided) => (
              <InnerContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tiles.map((tile, index) => {
                  return (
                    <Tile
                      id={tile.id}
                      key={`${tile.id}`}
                      index={index}
                      tile={tile}
                    />
                  );
                })}
                {provided.placeholder}
              </InnerContainer>
            )}
          </Droppable>
          <Handle
            {...provided.dragHandleProps}
            isDragDisabled={id.slice(-5) === "empty"}
          />
        </OuterContainer>
      )}
    </Draggable>

    //   <p>test</p>
  );
};

export default TileGroup;
