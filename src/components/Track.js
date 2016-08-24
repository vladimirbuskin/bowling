import React from 'react'
import { connect } from 'react-redux'
import { gameLastFrame } from '../reducers/index'


export default class Track extends React.Component {

  constructor(props) {
    super(props);
    this.startRoll = this.startRoll.bind(this);
  }

  startRoll() {
    var t = this;
    // add class
    this._ball.classList.add('roll');

    // after animation
    setTimeout(function() {
      t._ball.classList.remove('roll');
      t.props.onRoll();
    },1000);

  }

  render() {
    var track = this.props.track;
    var score = 0;
    var frames = [];
    for (var i=0;i<10;i++) frames[i] = i;

    var lastFrame = gameLastFrame(track.frames);

    return (
      <div>
        <div className="track">
          {/*<div className="pin"></div>*/}

          <div className="ball"
               ref={(c) => this._ball = c}
               onClick={this.startRoll}></div>
        </div>
        <div className="trackScoreTable">
          {
            frames.map(i => {
              var f = track.frames[i];
              score += f==null ? 0 : (f.score || 0);
              return (
                <div className="frame" key={i}>
                  <div className="first">{ f && (f.strike ? 'X' : f.first) }</div>
                  <div className="second">{ f && (f.strike ? '' : (f.spare ? '/' : f.second)) }</div>
                  <div className="score">{ f && f.score!=null && (score)}</div>
                </div>
              )
            })
          }
        </div>

        { track.isOver &&
        <div>
          <div>GAME OVER</div>
          <button onClick={this.props.onRestart}>RESTART</button>
        </div>
        }
        { !track.isOver &&
          <button onClick={this.props.onRoll}>ROLL</button>
        }
      </div>
    )
  }
}