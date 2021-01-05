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
