/**
 * Created by Vladimir on 8/26/2016.
 */
import React from 'react'



export default class TrackPlayers extends React.Component {

  
  render() {
    var t = this;
    var game = this.props.game;


    var frames = [];
    for (var i=0;i<10;i++) frames[i] = i;

    return (
    <div>
      {game.players.map((p,i) => {
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
      })}
    </div>)
  }
}