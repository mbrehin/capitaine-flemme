import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Tone from 'tone'

import { withStyles } from '../../node_modules/@material-ui/core'

import { song } from '../utils/song'
import SoundButton from './SoundButtonGroup'

const styles = (theme) => ({
  buttons: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
})

class Player extends Component {
  constructor(...args) {
    super(...args)
    // Create a synth and connect it to the master output (your speakers)
    this.synth = new Tone.Synth().toMaster()
  }

  playTrack = ({ frequency, duration }) => {
    this.synth.triggerAttackRelease(frequency, duration)
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.buttons}>
        {song.map((sounds, index) => (
          <SoundButton sounds={sounds} key={index} onClick={this.playTrack} />
        ))}
      </div>
    )
  }
}

Player.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Player)
