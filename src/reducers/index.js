// import { combineReducers } from 'redux';
//
// export default combineReducers({
//
// });

var initialState = {

  isOver: false,
  score: 0,

  frames: [
    // {
    //   first: 10,
    //   second: null,
    //   strike: true,
    //   spare: false,
    //   score: 30
    // }
  ]

};



export default function counter(state = initialState, action) {
  switch (action.type) {
    case 'ROLL':
      return roll(state);
    case 'RESTART':
      return {...initialState};
    default:
      return state
  }
}

function frameIsDone(frame)
{
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

function gameIsOver(frames)
{
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
  return Math.round(Math.random() * range * 3 /*3 times bigger possibility*/);
}

export function roll(state, value)
{
  var ns = {
    ...state,
    frames: [...state.frames]
  };

  // last frame
  var lastFrame = gameLastFrame(ns.frames);
  value = getRundomRollValue(10 - (lastFrame!=null ? lastFrame.first : 0));

  // если конец
  if (!gameIsOver(state.frames))
  {
    ns.frames = [...state.frames];

    lastFrame = gameLastFrame(ns.frames);
    if (lastFrame == null || frameIsDone(lastFrame))
    {
      if (value > 10)
        value = 10;
      if (value < 0)
        value = 0;

      // we adds another frame
      lastFrame = {first: value };
      ns.frames.push(lastFrame);
    }
    else
    {
      lastFrame = {...lastFrame};
      lastFrame.second = value;

      // validate
      if (lastFrame.first + lastFrame.second > 10)
        lastFrame.second = 10 - lastFrame.first;

      // set
      ns.frames[ns.frames.length-1] = lastFrame;
    }

    // set flags
    if (frameIsStrike(lastFrame))
      lastFrame.strike = true;

    if (frameIsSpare(lastFrame))
      lastFrame.spare = true;

    if (gameIsOver(ns.frames))
      ns.isOver = true;

    // score
    var totalScore = 0;
    for (var i = 0; i < ns.frames.length; i++)
    {
      var curFrame = ns.frames[i];
      var fs = frameScore(ns.frames, i);
      // set frame score
      if (fs != null && curFrame.score == null)
      {
        ns.frames[i] = curFrame = {
          ...curFrame,
          score: fs
        };
      }
      totalScore += fs;
    }

    ns.score = totalScore;
  }
  return ns;
}