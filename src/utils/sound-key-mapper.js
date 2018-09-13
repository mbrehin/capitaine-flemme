import Tone from 'tone'

import { song } from './song'

export const triggerSoundOnKeyUp = () => {
  const sounds = song.reduce((acc, sound) => acc.concat(sound), [])
  console.log(sounds)

  document.addEventListener(
    'keyup',
    (event) => {
      const keyPressed = event.key.toUpperCase()
      const sound = sounds.filter(({ key }) => keyPressed === key)
      if (!sound.length) {
        return
      }
      const { frequency, duration } = sound[0]
      const synth = new Tone.Synth().toMaster()
      synth.triggerAttackRelease(frequency, duration)
    },
    false
  )
}
