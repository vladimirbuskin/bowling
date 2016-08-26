import React from 'react'
import { connect } from 'react-redux'
import Track from './Track'
import {
  roll,
  addPlayer,
  removePlayer,
  changePlayer,
  restart
} from '../actions/gameActions'

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
                 onRestart={this.props.restart}
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
    roll,
    addPlayer,
    removePlayer,
    changePlayer,
    restart
  }
)(App);

export default AppVisible