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
