export const startTurn = (state) => {
  return {
    ...state,
    previousStates: [],
  };
};
