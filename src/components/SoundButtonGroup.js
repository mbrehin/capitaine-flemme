import { arrayOf, func, number, object, shape, string } from 'prop-types'
import React from 'react'

import { Button, withStyles } from '@material-ui/core'

const styles = (theme) => ({
  button: {
    display: 'inline-flex',
    margin: theme.spacing.unit,
  },
})

const SoundButtonGroup = ({ classes, sounds, xs, onClick }) => {
  return (
    <span className={classes.button}>
      {sounds.map(({ label, duration, frequency, key }) => (
        <Button
          variant="contained"
          key={`${label}-${frequency}`}
          onClick={() => onClick({ frequency, duration })}
          title={`Touche « ${key} »`}
        >
          {label}
        </Button>
      ))}
    </span>
  )
}

SoundButtonGroup.propTypes = {
  classes: object.isRequired,
  sounds: arrayOf(
    shape({
      label: string.isRequired,
      frequency: string.isRequired,
      duration: number.isRequired,
    })
  ).isRequired,
  xs: number,
  onClick: func,
}

export default withStyles(styles)(SoundButtonGroup)
