import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { triggerSoundOnKeyUp } from './utils/sound-key-mapper'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

triggerSoundOnKeyUp()
