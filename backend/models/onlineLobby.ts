import { GameSettingsType, GuessType, LocationType } from '@types'

import Map from './map'
import User from './user'

// TODO: update types
type OnlineLobby = {
  id: string
  map: Map
  gameSettings: GameSettingsType
  rounds: LocationType[]
  guesses: GuessType[]
  players: User[] | string[]
  state: 'waiting' | 'playing' | 'finished'
}

export default OnlineLobby
