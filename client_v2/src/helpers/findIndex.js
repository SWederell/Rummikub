export const findIndex = (array, find) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === find) {
      return i;
    }
  }
};
