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
