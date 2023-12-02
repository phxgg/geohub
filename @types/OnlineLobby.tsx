import { ObjectId } from 'mongodb'
import { GameSettingsType, LocationType, MapType } from './'

type OnlineLobby = {
  _id: ObjectId | string
  mapId: string
  gameSettings: GameSettingsType
  locations: LocationType[]
  creatorId: ObjectId | string
  creatorName: string
  creatorAvatar: { emoji: string; color: string }
  mapDetails?: MapType
  mode: 'standard'
  state: 'waiting' | 'playing' | 'finished'
}

export default OnlineLobby
