import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { Game } from '@backend/models'
import getMapFromGame from '@backend/queries/getMapFromGame'
import { collections, getUserId, throwError } from '@backend/utils'

const createLobbyGame = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = await getUserId(req, res)
  const lobbyId = req.query.id as string
  const { mapId, gameSettings, locations } = req.body

  // Ensure user has not already played this lobby
  const hasAlreadyPlayed = await collections.games
    ?.find({ onlineLobbyId: new ObjectId(lobbyId), userId: new ObjectId(userId) })
    .count()

  if (hasAlreadyPlayed) {
    return throwError(res, 400, 'You have already played this lobby')
  }

  const newGame = {
    mapId: new ObjectId(mapId),
    userId: new ObjectId(userId),
    onlineLobbyId: new ObjectId(lobbyId),
    mode: 'standard',
    gameSettings,
    guesses: [],
    rounds: locations,
    round: 1,
    totalPoints: 0,
    totalDistance: { metric: 0, imperial: 0 },
    totalTime: 0,
    streak: 0,
    state: 'started',
    createdAt: new Date(),
  }

  // Create game that is associated with this lobby
  const result = await collections.games?.insertOne(newGame)

  if (!result) {
    return throwError(res, 400, 'Failed to create your game in this lobby')
  }

  const mapDetails = await getMapFromGame(newGame as Game)

  const _id = result.insertedId

  res.status(201).send({ _id, ...newGame, mapDetails })
}
export default createLobbyGame
