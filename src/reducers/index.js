// import { combineReducers } from 'redux';
//
// export default combineReducers({
//
// });
//var _ = require('lodash');

var initialState = {

  isStart: true,

  isOver: false,

  rollIndex: 0,

  activePlayerIndex: 0,

  players: [
    {
      name:'player',
      frames: [
        // {
        //   first: 10,
        //   second: null,
        //   strike: true,
        //   spare: false,
        //   score: 30
        // }
      ]
    }
  ]

};

var initialPlayer = {
  name: 'player',
  frames: []
}



export default function counter(state = initialState, action) {
  switch (action.type) {
    case 'ROLL':
      return roll(state, action.count);
    case 'ADD_PLAYER':
      return {
        ...initialState,
        players: [
          ...state.players,
          {...initialPlayer}
        ]
      };
    case 'REMOVE_PLAYER':

      // validate
      var cnt = state.players.length - 1;
      if (cnt<1) cnt = 1;

      return {
        ...initialState,
        players: [
          ...state.players.slice(0, cnt),
        ]
      };
    case 'CHANGE_PLAYER':
      return {
        ...initialState,
        players: [
          ...state.players.slice(0, action.index),
          {...state.players[action.index], name: action.name},
          ...state.players.slice(action.index+1)
        ]
      };
    case 'RESTART':
      return {...initialState};
    default:
      return state
  }
}

function frameIsDone(frame) {
  return frameIsStrike(frame) || frame.second != null
}

function frameIsStrike(frame) {
  return frame.first == 10;
}

function frameIsSpare(frame) {
  return frame.first != null &&
    frame.second != null &&
    frame.first + frame.second == 10;
}

export function gameLastFrame(frames) {
  return frames[frames.length-1];
}

function gameIsOver(frames) {
  // если 10
  // if 10 strike then 2 more
  // if 10 spare then 1 more
  var lastFrame = frames[9];
  var extraFrame1 = frames[10];
  if (lastFrame) {
    if (lastFrame.strike) {
      return frames.length == 11 && extraFrame1.second != null || frames.length > 11;
    }
    if (lastFrame.spare) {
      return frames.length == 11;
    }
  }
  return frames.length == 10 && lastFrame.second != null;
}

function localSum(frame) {
  return frame.first + frame.second;
}

function frameScore(frames, i) {
  // we need to calc with next
  var frame = frames[i];
  if (frame.spare)
  {
    // calc with next
    var next = frames[i+1];
    if (next != null)
    {
      return localSum(frame) + next.first;
    }
    return null;
  }
  if (frame.strike)
  {
    // calc with two rolls
    // calc with next
    var next1 = frames[i+1];
    var next2 = frames[i+2];
    if (next1 != null)
    {
      if (next1.strike)
      {
        if (next2 != null)
          return frame.first + next1.first + next2.first;
        else
          // can't calculate yet
          return null;
      }
      else
      {
        if (next1.second != null)
          return frame.first + next1.first + next1.second;
        else
          // can't calculate yet
          return null;
      }
    }
    // can't calculate yet
    return null;
  }

  // wait till second throw
  if (frame.second == null)
    return null;

  // throws two times, not a spare
  return frame.first + frame.second;
}

function getRundomRollValue(range) {
  return Math.round(Math.random() * range /*3 times bigger possibility*/);
}

export function gameCurrentPlayer(game) {
  return game.players[game.activePlayerIndex];
}

export function gameCurrentPlayerFrames(game) {
  return (gameCurrentPlayer(game) || {}).frames || [];
}

export function roll(state, value) {

  var ns = {
    ...state
  };

  var player = gameCurrentPlayer(ns);

  var frames = player.frames = [...player.frames];

  // last frame
  var lastFrame = gameLastFrame(frames);
  value = value!=null ? value : getRundomRollValue(10 - (lastFrame!=null ? lastFrame.first : 0));

  // is over
  if (!gameIsOver(frames))
  {
    lastFrame = gameLastFrame(frames);
    if (lastFrame == null || frameIsDone(lastFrame))
    {
      if (value > 10)
        value = 10;
      if (value < 0)
        value = 0;

      // we adds another frame
      lastFrame = {first: value };
      frames.push(lastFrame);
    }
    else
    {
      lastFrame = {...lastFrame};
      lastFrame.second = value;

      // validate
      if (lastFrame.first + lastFrame.second > 10)
        lastFrame.second = 10 - lastFrame.first;

      // set
      frames[frames.length-1] = lastFrame;
    }

    // set flags
    if (frameIsStrike(lastFrame))
      lastFrame.strike = true;

    if (frameIsSpare(lastFrame))
      lastFrame.spare = true;

    // player game is over and this is the last player
    if (gameIsOver(frames) && ns.players.length == ns.activePlayerIndex+1)
      ns.isOver = true;

    // score
    var totalScore = 0;
    for (var i = 0; i < frames.length; i++)
    {
      var curFrame = frames[i];
      var fs = frameScore(frames, i);
      // set frame score
      if (fs != null && curFrame.score == null)
      {
        frames[i] = curFrame = {
          ...curFrame,
          score: fs
        };
      }
      totalScore += fs;
    }

    ns.rollIndex++;
    ns.isStart = false;

    // change player
    if (lastFrame.strike || lastFrame.second!=null)
    {
      ns.activePlayerIndex++;
      // move index to next player
      ns.activePlayerIndex = ns.activePlayerIndex % ns.players.length;
    }
  }
  return ns;
}