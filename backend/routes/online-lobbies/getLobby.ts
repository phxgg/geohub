import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import getMapFromGame from '@backend/queries/getMapFromGame'
import { collections, getUserId, throwError } from '@backend/utils'
import { OnlineLobbyType } from '@types'

const getLobby = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = await getUserId(req, res)
  const lobbyId = req.query.id as string

  const lobby = await collections.onlineLobbies?.findOne({ _id: new ObjectId(lobbyId) })

  if (!lobby) {
    return throwError(res, 404, 'Failed to find lobby')
  }

  // Get user details of lobby creator
  let lobbyCreator = null
  lobbyCreator = await collections.users?.findOne({ _id: lobby.creatorId })

  if (!lobbyCreator) {
    return throwError(res, 404, 'Failed to find lobby')
  }

  // let lobbyPlayers = null
  // lobbyPlayers = await collections.users?.find({ _id: { $in: lobby.players } }).toArray()

  let playersGame = null

  if (userId) {
    playersGame = await collections.games?.findOne({
      userId: new ObjectId(userId),
      onlineLobbyId: new ObjectId(lobbyId),
    })
  }

  const mapDetails = await getMapFromGame(lobby as OnlineLobbyType)

  if (!mapDetails) {
    return throwError(res, 404, 'Failed to find lobby')
  }

  const lobbyBelongsToUser = lobby.creatorId && lobby.creatorId.toString() === userId

  const result = {
    ...lobby,
    creatorName: lobbyCreator?.name,
    creatorAvatar: lobbyCreator?.avatar,
    playersGame,
    mapDetails,
    lobbyBelongsToUser,
  }

  res.status(200).send(result)
}

export default getLobby
