import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { collections, getLocations, getUserId } from '@backend/utils'

const createLobby = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = await getUserId(req, res)
  const { mapId, gameSettings } = req.body

  const numLocationsToGenerate = 5
  const locations = await getLocations(mapId, numLocationsToGenerate)

  if (locations === null) {
    return res.status(400).send('Invalid map Id, lobby could not be created')
  }

  const newLobby = {
    mapId: new ObjectId(mapId),
    creatorId: new ObjectId(userId),
    mode: 'standard',
    gameSettings,
    locations,
    state: 'waiting',
  }

  // Create Lobby
  const result = await collections.onlineLobbies?.insertOne(newLobby)

  if (!result) {
    return res.status(500).send('Failed to create a new lobby.')
  }

  res.status(201).send(result.insertedId)
}

export default createLobby
