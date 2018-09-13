import PropTypes from 'prop-types'
import React from 'react'

import { Typography } from '../node_modules/@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'

import 'typeface-roboto'

import Player from './components/Player'

const styles = (theme) => ({
  heroContent: {
    color: '#fff',
    margin: '0 auto',
    maxWidth: 600,
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 6}px`,
  },
  layout: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexGrow: 1,
    margin: theme.spacing.unit * 3,
    // padding: theme.spacing.unit * 2,
    padding: `${theme.spacing.unit * 6}px 0`,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    width: 'auto',
  },
  title: {
    fontFamily: "'Bungee Shade', cursive",
    color: '#486779',
  },
})

const App = ({ classes }) => {
  return (
    <main className={classes.layout}>
      <CssBaseline />
      <div className={classes.heroContent}>
        <Typography
          className={classes.title}
          variant="display2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Capitaine Flemme
        </Typography>
        <Typography align="center" color="textSecondary" component="p">
          Chaque bouton désigne une note de la chanson.
          <br />
          Vous pouvez également utiliser votre clavier (AZERTYU / QSDFGH).
        </Typography>
      </div>
      <Player />
    </main>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App)
