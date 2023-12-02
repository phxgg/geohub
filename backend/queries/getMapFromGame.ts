import { ObjectId } from 'mongodb'
import { Game } from '@backend/models'
import { collections } from '@backend/utils'
import { ChallengeType, GameType, OnlineLobbyType } from '@types'
import { COUNTRY_STREAKS_ID, OFFICIAL_WORLD_ID } from '@utils/constants/random'

const getMapFromGame = async (game: GameType | Game | ChallengeType | OnlineLobbyType) => {
  const mapId = (game as ChallengeType).isDailyChallenge || game.mapId === COUNTRY_STREAKS_ID ? OFFICIAL_WORLD_ID : game.mapId
  const mapDetails = await collections.maps?.findOne({ _id: new ObjectId(mapId) })

  return mapDetails
}

export default getMapFromGame
