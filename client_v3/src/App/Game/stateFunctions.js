import uuid from "uuid";

export const moveTilesAndGroups = (state, result) => {
  console.log("moveTiles called");

  var tempState = {
    ...state,
    previousStates: [...state.previousStates, state],
  };
  const { destination, source, draggableId, type } = result;

  if (!destination) return tempState;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return tempState;

  let SourcePrefix = source.droppableId.slice(0, 5);
  let DestinationPrefix = destination.droppableId.slice(0, 5);

  if (state.playersTurn && DestinationPrefix === "field") return tempState;

  if (SourcePrefix === "field" && DestinationPrefix === "stand")
    return tempState;

  if (DestinationPrefix === "field" && SourcePrefix === "stand") {
    tempState = {
      ...tempState,
      standToField: true,
    };
  }

  if (type === "group") {
    // =======================
    // Handle Tile Group Moves
    // =======================

    console.log("you are moving a group of tiles");

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
      if (tempState.standTileGroups[draggableId].draw) {
        tempState = {
          ...tempState,
          standTileGroups: {
            ...tempState.standTileGroups,
            [draggableId]: {
              ...tempState.standTileGroups[draggableId],
              draw: false,
            },
          },
        };
      }

      tempState = {
        ...tempState,
        fieldTileGroups: {
          ...tempState.fieldTileGroups,
          [draggableId]: {
            ...tempState.standTileGroups[draggableId],
          },
        },
      };

      delete tempState.standTileGroups[draggableId];

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

  // =================
  // Handle Tile Moves
  // =================

  const startTileGroup =
    tempState[`${SourcePrefix}TileGroups`][source.droppableId];

  let finishTileGroup =
    tempState[`${DestinationPrefix}TileGroups`][destination.droppableId];

  const movedTile = {
    ...startTileGroup.tiles[source.index],
  };

  // ==============================
  // Handle Dropping on Empty Group
  // ==============================

  if (destination.droppableId.slice(-5) === "empty") {
    console.log("dragging to empty group");

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
    console.log("moving tile inside group");
    const newTiles = Array.from(startTileGroup.tiles);
    newTiles.splice(source.index, 1);
    newTiles.splice(destination.index, 0, movedTile);

    const newTileGroup = {
      ...startTileGroup,
      tiles: checkValidityOfTilesInGroup(newTiles, startTileGroup.draw),
    };

    tempState = {
      ...tempState,
      [`${DestinationPrefix}TileGroups`]: {
        ...tempState[`${DestinationPrefix}TileGroups`],
        [newTileGroup.id]: newTileGroup,
      },
    };
    return tempState;
  }

  // Moving tiles between groups

  console.log("moving tile between groups");

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

  tempState = {
    ...tempState,
    [`${DestinationPrefix}TileGroups`]: {
      ...state[`${DestinationPrefix}TileGroups`],
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    },
  };

  if (newStart.tiles.length === 0) {
    tempState = RemoveEmptyTileGroup(tempState, newStart);
  }

  return tempState;
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

export const findIndex = (array, find) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === find) {
      return i;
    }
  }
};

export const createNewTileGroup = (state, type) => {
  const newTileGroupId = `${uuid()}`;
  let newTileGroup = { id: newTileGroupId, type: type, tiles: [] };
  let newDisplayOrder = [...state[`${type}DisplayOrder`]];

  newDisplayOrder.splice(newDisplayOrder.length - 1, 0, newTileGroupId);

  let tempState = {
    ...state,
    tileGroups: {
      ...state[`${type}TileGroups`],
      [newTileGroupId]: newTileGroup,
    },
    [`${type}DisplayOrder`]: newDisplayOrder,
  };

  return [tempState, newTileGroup];
};

export const HandleDrawnTiles = (state, tiles) => {
  let tempState = { ...state };

  for (let group in tiles) {
    let [retState, newTileGroup] = createNewTileGroup(tempState, "stand");

    if (
      tiles.length * tiles[0].length === 14 ||
      tempState.initialDrawComplete
    ) {
      retState = { ...retState, initialDrawComplete: true };
    }

    newTileGroup = {
      ...newTileGroup,
      draw: true,
      tiles: [...tiles[group]],
    };

    tempState = {
      ...retState,
      standTileGroups: {
        ...retState.standTileGroups,
        [newTileGroup.id]: newTileGroup,
      },
    };
  }

  console.log({ tempState });

  return tempState;
};

export const separateForServerUpdate = (prevState) => {
  const tempState = { ...prevState };
  delete tempState["standDisplayOrder"];
  delete tempState["standTileGroups"];
  delete tempState["previousStates"];
  return tempState;
};

export const integrateServerUpdate = (localState, serverState) => {
  console.dir({ localState, serverState });
  const tempState = {
    ...serverState,
    standDisplayOrder: [...localState.standDisplayOrder],
    standTileGroups: { ...localState.standTileGroups },
    previousStates: [...localState.previousStates],
  };

  return tempState;
};
