import React from 'react'
import { connect } from 'react-redux'
import { gameLastFrame, gameCurrentPlayerFrames, gameCurrentPlayer } from '../reducers/index'


export default class Track extends React.Component {

  constructor(props) {
    super(props);
    this.startRoll = this.startRoll.bind(this);
    var t = this;
    this.roll = function () { t.props.onRoll(null); }
    this.rollStrike = function () { t.props.onRoll(10); }
  }

  startRoll() {
    var t = this;
    // add class
    this._ball.classList.add('roll');

    // after animation
    setTimeout(function() {
      t._ball.classList.remove('roll');
      t.props.onRoll();
    }, 1000);

    // show bang
    setTimeout(function() {
      t._bang.classList.add('visible');
    }, 700);

    // hide bang
    setTimeout(function() {
      t._bang.classList.remove('visible');
    }, 1500);
  }

  renderPins(count) {

    var pins = [];

    //count = count || 8;

    var spaces = new Array(10);
    var empty = 10 - count;

    while (empty > 0)
    {
      var spaceIndex = Math.round(Math.random()*100)%10; // 9 round could be range from 0-9

      if (spaces[spaceIndex]!=true)
      {
        spaces[spaceIndex] = true;
        empty--;
      }
    }

    var width = 150;
    var dx = 25;
    var dy = 20;
    var y = 40;
    var x = 20;

    var inRow = 4;
    var pinIndex = -1;
    for (var i = 0; i < 10; i++) {
      x = (width/2) - ((inRow * dx)/2) - dx;
      for (var j = 0; j < inRow; j++) {
        pinIndex++;
        x += dx;
        pins.push(<div className="pin" key={pinIndex} style={{top:y, left:x}}>
          {
            spaces[pinIndex]!=true &&
            <i></i>
          }
        </div>);
      }
      inRow --;
      y += dy;
    }

    return pins;
  }

  render() {
    var t = this;
    var game = this.props.game;
    var frames = [];
    for (var i=0;i<10;i++) frames[i] = i;

    // could be null
    var lastFrame = gameLastFrame(gameCurrentPlayerFrames(game));

    var pinsOnField = 10;

    if (lastFrame && !lastFrame.strike && lastFrame.second==null)
      pinsOnField = 10 - lastFrame.first;

    return (
      <div className="game">
        <div className="track">
          {this.renderPins(pinsOnField)}

          <div className="ball"
               ref={(c) => this._ball = c}
               onClick={this.startRoll}></div>

          <div className="bang" ref={(c) => this._bang = c}></div>
        </div>

        {
          this.props.game.players.map((p,i) => {
            var score = 0;
            return (
            <div className="trackScoreTable" key={i}>
              <div className="playerName">
                { game.isStart &&
                  <input value={p.name} onChange={(event) => { t.props.onChangePlayer(i, event.target.value) }} />
                }
                { !game.isStart && p.name }
              </div>
              {
                frames.map(i => {
                  var f = p.frames[i];
                  score += f == null ? 0 : (f.score || 0);
                  return (
                    <div className="frame" key={i}>
                      <div className="first">{ f && (f.strike ? 'X' : f.first) }</div>
                      <div className="second">{ f && (f.strike ? '' : (f.spare ? '/' : f.second)) }</div>
                      <div className="score">{ f && f.score != null && (score)}</div>
                    </div>
                  )
                })
              }
            </div>)
          })
        }


        { game.isStart &&
        <div style={{marginBottom: '1em'}}>
          <button onClick={this.props.onAddPlayer}>Add Player</button>
          <button onClick={this.props.onRemovePlayer}>Remove Player</button>
        </div>
        }

        { !game.isOver &&
          <div>
            <button onClick={this.roll}>TEST ROLL</button>
            <button onClick={this.rollStrike}>TEST ROLL X</button>
            <span>Animated play works by clicking on Ball...</span>
          </div>
        }

        { game.isOver &&
          <div>
            <button onClick={this.props.onRestart}>RESTART</button>
            <div className="gameOver">GAME OVER</div>
          </div>
        }
      </div>
    )
  }
}