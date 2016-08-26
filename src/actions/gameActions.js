export const ROLL = "ROLL";
export const RESTART = "RESTART";
export const ADD_PLAYER = "ADD_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";
export const CHANGE_PLAYER = "CHANGE_PLAYER";

export function roll(count) {
  return {
    type: "ROLL",
    count: count
  }
}
export function restart() {
  return {
    type: "RESTART"
  }
}
export function addPlayer() {
  return {
    type: "ADD_PLAYER"
  }
}

export function removePlayer() {
  return {
    type: "REMOVE_PLAYER"
  }
}

export function changePlayer(index, name) {
  return {
    type: "CHANGE_PLAYER",
    index,
    name
  }
}