/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect, throwError } from '@backend/utils'
import getLobby from '@backend/routes/online-lobbies/getLobby'
import createLobbyGame from '@backend/routes/online-lobbies/createLobbyGame'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect()

    switch (req.method) {
      case 'GET':
        return getLobby(req, res)
      case 'POST':
        return createLobbyGame(req, res)
      default:
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    return throwError(res, 500, 'An unexpected server error occured')
  }
}
