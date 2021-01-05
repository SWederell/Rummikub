import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  width: 6vmin;
  height: 6vmin;
  border-radius: 5px;
  background-color: ${(props) =>
    props.tile.error ? chooseColour(props.colour) : "wheat"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${(props) =>
    props.tile.error ? "wheat" : chooseColour(props.colour)};
`;

const EmptyContainer = styled.div`
  display: ${(props) => (props.isDraggingOver ? "none" : "block")};
  width: 6vmin;
  min-width: 6vmin;
  height: 6vmin;
  border-radius: 5px;
  background-color: inherit;
  border: 2px dashed black;
`;

const chooseColour = (colour) => {
  switch (colour) {
    case "red":
      return "red";
    case "bla":
      return "black";
    case "blu":
      return "blue";

    case "yel":
      return "goldenrod";

    default:
      return "wheat";
  }
};
const Number = styled.span``;

const Tile = (props) => {
  // console.log(this.props);
  const { id, tile, index } = props;

  let colour = "red";
  let number = 20;

  if (id && id !== "empty") {
    colour = id.slice(0, 3);
    number = id.slice(4, 6);
  }

  return id !== "empty" ? (
    <Draggable draggableId={id} index={index} type="tile">
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          colour={colour}
          tile={tile}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {number === "jo" ? (
            <p>
              <span role="img" aria-label="joker">
                😊
              </span>
            </p>
          ) : (
            <Number>{+number}</Number>
          )}
        </Container>
      )}
    </Draggable>
  ) : (
    <EmptyContainer />
  );
};

export default Tile;
