import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '../../node_modules/@material-ui/core'
import SoundButton from './SoundButton'

const styles = (theme) => ({
  buttons: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
})

class Player extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.buttons}>
        <SoundButton labels={['ca', 'pi', 'taine']} />
        <SoundButton labels={['flemme']} />
        <SoundButton labels={['tu']} />
        <SoundButton labels={['n’es']} />
        <SoundButton labels={['pas']} />
        <SoundButton labels={['de']} />
        <SoundButton labels={['notre']} />
        <SoundButton labels={['ga', 'la', 'xie']} />
      </div>
    )
  }
}

Player.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Player)
