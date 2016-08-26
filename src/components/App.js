import React from 'react'
import { connect } from 'react-redux'
import Track from './Track'


class App extends React.Component {


  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {
          <Track game={this.props.game}
                 onRoll={this.props.roll}
                 onRestart={() => {this.props.restart()}}
                 onAddPlayer={this.props.addPlayer}
                 onRemovePlayer={this.props.removePlayer}
                 onChangePlayer={this.props.changePlayer}
          />
        }
      </div>
    )
  }
}

var AppVisible = connect(
  state => ({
    game: state
  }),
  {
    roll: function(count) {
      return {
        type: "ROLL",
        count: count
      }
    },
    restart: function() {
      return {
        type: "RESTART"
      }
    },
    addPlayer: function() {
      return {
        type: "ADD_PLAYER"
      }
    },
    removePlayer: function() {
      return {
        type: "REMOVE_PLAYER"
      }
    },
    changePlayer: function(index, name) {
      return {
        type: "CHANGE_PLAYER",
        index,
        name
      }
    }
  }
)(App);

export default AppVisible