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
