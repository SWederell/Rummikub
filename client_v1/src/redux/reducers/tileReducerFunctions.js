import uuid from "react-uuid";

export const moveTilesAndGroups = (state, { result }) => {
  var tempState = {
    ...state,
    previousStates: [...state.previousStates, state],
  };

  const { destination, source, draggableId, type } = result;

  if (!destination) {
    return tempState;
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return tempState;
  }

  // =======================
  // Handle Tile Group Moves
  // =======================
  if (type === "group") {
    let SourcePrefix = source.droppableId.slice(0, 3);
    let DestinationPrefix = destination.droppableId.slice(0, 3);

    // console.log({ destination, source });
    switch (DestinationPrefix) {
      case "gam":
        DestinationPrefix = "area";
        break;
      case "til":
        DestinationPrefix = "stand";
        break;

      default:
        break;
    }
    switch (SourcePrefix) {
      case "gam":
        SourcePrefix = "area";
        break;
      case "til":
        SourcePrefix = "stand";
        break;

      default:
        break;
    }

    if (DestinationPrefix === "area" && SourcePrefix === "stand") {
      tempState = {
        ...tempState,
        standToArea: true,
      };
    }

    const newDisplayOrderSource = Array.from(
      tempState[`${SourcePrefix}DisplayOrder`]
    );
    const newDisplayOrderDestination = Array.from(
      tempState[`${DestinationPrefix}DisplayOrder`]
    );

    if (source.droppableId === destination.droppableId) {
      newDisplayOrderDestination.splice(source.index, 1);
      newDisplayOrderDestination.splice(
        destination.index === newDisplayOrderDestination.length
          ? destination.index - 1
          : destination.index,
        0,
        draggableId
      );
    } else {
      if (tempState.tileGroups[draggableId].draw) {
        tempState = {
          ...tempState,
          tileGroups: {
            ...tempState.tileGroups,
            [draggableId]: {
              ...tempState.tileGroups[draggableId],
              draw: false,
            },
          },
        };
      }
      newDisplayOrderSource.splice(source.index, 1);
      newDisplayOrderDestination.splice(
        destination.index === newDisplayOrderDestination.length
          ? destination.index - 1
          : destination.index,
        0,
        draggableId
      );
    }

    tempState[`${SourcePrefix}DisplayOrder`] = newDisplayOrderSource;
    tempState[`${DestinationPrefix}DisplayOrder`] = newDisplayOrderDestination;
    // console.log({ tempState });
    return tempState;
  }

  const startTileGroup = tempState.tileGroups[source.droppableId];

  let finishTileGroup = tempState.tileGroups[destination.droppableId];
  const movedTile = {
    ...startTileGroup.tiles[source.index],
  };

  // ==============================
  // Handle Dropping on Empty Group
  // ==============================

  if (destination.droppableId.slice(-5) === "empty") {
    let DestinationPrefix = destination.droppableId.slice(0, 3);

    switch (DestinationPrefix) {
      case "are":
        DestinationPrefix = "area";
        break;
      case "sta":
        DestinationPrefix = "stand";
        break;

      default:
        break;
    }

    finishTileGroup = {
      id: `${uuid()}`,
      type: DestinationPrefix,
      tiles: [],
    };

    const newTileGroupDisplayOrder = [
      ...tempState[`${DestinationPrefix}DisplayOrder`],
    ];
    newTileGroupDisplayOrder.splice(
      newTileGroupDisplayOrder.length - 1,
      0,
      finishTileGroup.id
    );

    tempState = {
      ...tempState,
      [`${DestinationPrefix}DisplayOrder`]: newTileGroupDisplayOrder,
    };
  }

  // Moving Tiles within the same group

  if (startTileGroup === finishTileGroup) {
    const newTiles = Array.from(startTileGroup.tiles);
    newTiles.splice(source.index, 1);
    newTiles.splice(destination.index, 0, movedTile);

    const newTileGroup = {
      ...startTileGroup,
      tiles: checkValidityOfTilesInGroup(newTiles, startTileGroup.draw),
    };

    tempState = {
      ...tempState,
      tileGroups: {
        ...tempState.tileGroups,
        [newTileGroup.id]: newTileGroup,
      },
    };
    return tempState;
  }

  // Moving tiles between groups

  const startTiles = Array.from(startTileGroup.tiles);
  startTiles.splice(source.index, 1);
  let newStart = {
    ...startTileGroup,
    tiles: checkValidityOfTilesInGroup(startTiles, startTileGroup.draw),
  };

  const finishTiles = Array.from(finishTileGroup.tiles);
  finishTiles.splice(destination.index, 0, movedTile);
  const newFinish = {
    ...finishTileGroup,
    tiles: checkValidityOfTilesInGroup(finishTiles, finishTileGroup.draw),
  };

  if (
    tempState.areaDisplayOrder.includes(destination.droppableId) &&
    tempState.standDisplayOrder.includes(source.droppableId)
  ) {
    tempState = { ...tempState, standToArea: true };
  }
  tempState = {
    ...tempState,
    tileGroups: {
      ...state.tileGroups,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    },
  };

  if (newStart.tiles.length === 0) {
    tempState = RemoveEmptyTileGroup(tempState, newStart);
  }

  return tempState;
};

export const createNewTileGroup = (state, type) => {
  const newTileGroupId = `${uuid()}`;
  let newTileGroup = { id: newTileGroupId, type: type, tiles: [] };
  let newDisplayOrder = [...state[`${type}DisplayOrder`]];

  newDisplayOrder.splice(newDisplayOrder.length - 1, 0, newTileGroupId);

  let tempState = {
    ...state,
    tileGroups: { ...state.tileGroups, [newTileGroupId]: newTileGroup },
    [`${type}DisplayOrder`]: newDisplayOrder,
  };

  return { tempState, newTileGroup };
};

export const findIndex = (array, find) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === find) {
      return i;
    }
  }
};

export const RemoveEmptyTileGroup = (state, group) => {
  let tempState = { ...state };
  let type = group.type;

  let newDisplayOrder = [...state[`${type}DisplayOrder`]];

  let groupIndex = findIndex(newDisplayOrder, group.id);
  newDisplayOrder.splice(groupIndex, 1);

  let newTileGroups = { ...tempState.tileGroups };
  delete newTileGroups[group.id];

  tempState = {
    ...tempState,
    tileGroups: newTileGroups,
    [`${type}DisplayOrder`]: newDisplayOrder,
  };

  return tempState;
};

export const RecieveDrawnTiles = (state, payload) => {
  const newTuple = createNewTileGroup(state, "stand");
  let newTileGroup = newTuple.newTileGroup;
  let tempState = { ...newTuple.tempState };

  if (payload.length === 14) {
    tempState = { ...tempState, initialDrawComplete: true };
  }

  newTileGroup = {
    ...newTileGroup,
    draw: true,
    tiles: [...payload],
  };

  tempState = {
    ...tempState,
    tileGroups: {
      ...tempState.tileGroups,
      [newTileGroup.id]: newTileGroup,
    },
  };

  console.log({ tempState });

  return tempState;
};

export const startTurn = (state) => {
  return {
    ...state,
    previousStates: [],
  };
};

export const checkValidityOfTilesInGroup = (set, draw) => {
  let newTileSet = set;

  if (draw) {
    return newTileSet;
  }

  // check that group has 3 or more tiles in it.

  if (newTileSet.length < 3) {
    // if less than 3 tiles in group ---- ILLEGAL SET
    newTileSet = newTileSet.map((tile) => {
      return { ...tile, error: true };
    });
    return newTileSet;
  } else {
    // reset error state on tiles
    newTileSet = newTileSet.map((tile) => {
      return { ...tile, error: false };
    });
  }

  // detect if run or group

  let groupType;
  let tileColour = "";
  for (let i = 0; i < newTileSet.length; i++) {
    let tile = newTileSet[i];
    const tileId = tile.id;
    if (tileId.slice(0, 3) === "jok") {
      continue;
    }

    if (tileColour === "") {
      tileColour = tileId.slice(0, 3);
      continue;
    }
    if (tileId.slice(0, 3) === tileColour) {
      groupType = "run";
      break;
    } else {
      groupType = "group";
      break;
    }
  }

  // check tiles are all different colours and the same number
  if (groupType === "group") {
    let tileColours = [];
    let repeatedTileColours = [];
    let number;
    newTileSet = newTileSet.map((tile) => {
      // console.log({ tileColours, repeatedTileColours, number, tile });

      const tileId = tile.id;
      const colour = tileId.slice(0, 3);

      if (colour === "jok") {
        // if the tile is a joker
      } else if (tileColours.length === 0) {
        // if this is the first non-joker tile
        tileColours.push(colour);
        number = +tileId.slice(4, 6);
      } else if (tileColours.includes(colour)) {
        // if the colour is the same as a previous tile
        repeatedTileColours.push(colour);
      } else if (+tileId.slice(4, 6) !== number) {
        // if the number is not the same
      } else {
        tileColours.push(colour);
      }
      return tile;
    });

    newTileSet = newTileSet.map((tile) => {
      // run through tile set and set error state on each tile
      const colour = tile.id.slice(0, 3);
      if (repeatedTileColours.includes(colour)) {
        return { ...tile, error: true };
      }
      return { ...tile, error: false };
    });
  }

  // check that tiles are the same colour and in ascending order
  if (groupType === "run") {
    let tileColour = "";
    let prevNumber;

    newTileSet = newTileSet.map((tile, index) => {
      // console.log({ tileColour, tile, index, newTileSet });

      const tileId = tile.id;
      const colour = tileId.slice(0, 3);
      const number = +tileId.slice(4, 6);
      // console.log({ colour, number });

      if (colour === "jok") {
        // if the tile is a joker
        if (prevNumber !== undefined) {
          // if this joker is not this first one
          prevNumber += 1;
        }
        return { ...tile, error: false };
      }

      if (tileColour === "") {
        // if this tile is the first non-joker tile
        tileColour = colour;
        prevNumber = number;
        return { ...tile, error: false };
      }
      if (colour !== tileColour) {
        // if this tile is not the same colour
        return { ...tile, error: true };
      }

      if (number === prevNumber + 1) {
        // if the number is the next in the sequence
        prevNumber = number;
        return { ...tile, error: false };
      } else {
        prevNumber = number;
        return { ...tile, error: true };
      }
    });
  }

  return newTileSet;
};
