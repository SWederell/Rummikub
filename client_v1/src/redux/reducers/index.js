import { tilesReducer } from "./tilesReducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({ tilesReducer });

export default rootReducer;
