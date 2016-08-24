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
          this.props.tracks.map((t,i) => (
            <Track key={i}
                   track={t}
                   onRoll={() => {this.props.roll()}}
                   onRestart={() => {this.props.restart()}}
            />
          ))
        }
      </div>
    )
  }
}

var AppVisible = connect(
  state => ({
    tracks: [state]
  }),
  {
    roll: function() {
      return {
        type: "ROLL"
      }
    },
    restart: function() {
      return {
        type: "RESTART"
      }
    }
  }
)(App);

export default AppVisible