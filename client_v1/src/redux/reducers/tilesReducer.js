import {
  MOVE_TILE,
  UNDO_MOVE,
  START_TURN,
  SIO_RECEIVE_DRAWN_TILE,
  SIO_UPDATE_GAME_ID,
} from "../actions";

import {
  moveTilesAndGroups,
  startTurn,
  RecieveDrawnTiles,
} from "./tileReducerFunctions";

const initialState = {
  gameStart: false,
  gameID: "",
  standToArea: false,
  initialDrawComplete: false,
  tileGroups: {
    "stand-empty": {
      id: "stand-empty",
      type: "stand",
      tiles: [{ id: "empty" }],
    },
    "area-empty": {
      id: "area-empty",
      type: "area",
      tiles: [{ id: "empty" }],
    },
  },
  areaDisplayOrder: ["area-empty"],
  standDisplayOrder: ["stand-empty"],
  previousStates: [],
};

const tilesReducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case MOVE_TILE:
      return moveTilesAndGroups(state, action.payload);

    case UNDO_MOVE:
      const previousStates = state.previousStates;
      if (previousStates.length === 0) {
        return state;
      }
      const tempState = { ...previousStates[previousStates.length - 1] };
      return tempState;

    case START_TURN:
      return startTurn(state);

    case SIO_RECEIVE_DRAWN_TILE:
      return RecieveDrawnTiles(state, action.payload);

    case SIO_UPDATE_GAME_ID:
      return {
        ...state,
        gameID: action.payload,
      };

    default:
      return state;
  }
};

export { tilesReducer };
