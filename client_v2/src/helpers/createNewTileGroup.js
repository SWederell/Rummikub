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
