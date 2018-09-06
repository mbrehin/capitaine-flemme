import React from 'react'
import PropTypes from 'prop-types'

import { Button, withStyles } from '../../node_modules/@material-ui/core'

const styles = (theme) => ({
  button: {
    display: 'inline-flex',
    margin: theme.spacing.unit,
  },
})

const SoundButton = ({ classes, labels, xs }) => {
  return (
    <span className={classes.button}>
      {labels.map((label) => (
        <Button variant="contained" key={label}>
          {label}
        </Button>
      ))}
    </span>
  )
}

SoundButton.propTypes = {
  classes: PropTypes.object.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  xs: PropTypes.number,
}

export default withStyles(styles)(SoundButton)
