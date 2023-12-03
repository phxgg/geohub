import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Game from '@backend/models/game'
import { NotFound } from '@components/errorViews'
import { StandardGameView } from '@components/gameViews'
import { LoadingPage } from '@components/layout'
import { Meta } from '@components/Meta'
import { useAppDispatch } from '@redux/hook'
import { updateStartTime } from '@redux/slices'
import StyledGamePage from '@styles/GamePage.Styled'
import { OnlineLobbyType, GameViewType, PageType, PlayerInLobbyType } from '@types'
import { mailman, showToast } from '@utils/helpers'
import { OnlineLobby } from '@components/OnlineLobby'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'

/* TODO: 
  - handle state of the lobby (waiting, playing, finished)
    - waiting: players can join the lobby and click 'ready' button. When all players are ready, the game starts
    - playing: players cannot join the lobby. When all players are finished, the game ends
    - finished: players cannot join the lobby. Players can see the results of the game
 */

let socket: any;
const OnlineLobbyPage: PageType = () => {
  const session = useSession();
  const [view, setView] = useState<GameViewType>('Game')
  const [lobbyData, setLobbyData] = useState<OnlineLobbyType | null>()
  const [gameData, setGameData] = useState<Game | null>()
  const [playersInLobby, setPlayersInLobby] = useState<PlayerInLobbyType[]>([])

  const router = useRouter()
  const lobbyId = router.query.id as string
  const dispatch = useAppDispatch()

  const socketInitiation = async () => {
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ['websocket'],
      query: {
        accessToken: session.status === 'authenticated' ? (session as any).data.accessToken : null
      }
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    socket.on('update:lobby', (lobbyData: any) => {
      console.log('update:lobby', lobbyData);
      setPlayersInLobby(lobbyData.playersInLobby);
    });
  }

  const fetchLobby = async () => {
    const res = await mailman(`online-lobbies/${lobbyId}`)

    const { lobbyBelongsToUser, playersGame, mapDetails } = res

    // If lobby not found -> show error page
    if (res.error) {
      return setLobbyData(null)
    }

    setLobbyData(res)
    // If the user is authenticated, join the lobby and set up disconnect event
    if (session.status === 'authenticated') {
      socket.emit('join:lobby', { lobbyId: res._id });
      socket.on('disconnect', () => {
        socket.emit('leave:lobby', { lobbyId: res._id });
      });
    }

    // If the user has not started the challenge yet
    if (!playersGame) {
      // return lobbyBelongsToUser ? await createGame(res) : setView('Start')
      return setView('Start');
    }

    // If they have finished the game, push to results page
    if (playersGame.state === 'finished') {
      return router.replace(`/results/online-lobby/${lobbyId}`)
    }

    // If they have not finished the game, set their game state
    setGameData({ ...playersGame, mapDetails })
  }

  const createGame = async (lobbyData: OnlineLobbyType) => {
    const gameData = {
      mapId: lobbyData.mapId,
      mode: lobbyData.mode,
      gameSettings: lobbyData.gameSettings,
      locations: lobbyData.locations,
    }

    // Store start time
    dispatch(updateStartTime({ startTime: new Date().getTime() }))

    const res = await mailman(`online-lobbies/${lobbyId}`, 'POST', JSON.stringify(gameData))

    if (res.error) {
      return showToast('error', res.error.message)
    }

    setGameData(res)
  }

  useEffect(() => {
    if (!lobbyId) {
      return
    }
    // Initialize socket
    socketInitiation();
    // Fetch lobby data
    if (view === 'Game') {
      fetchLobby()
    }
    // Disconnect socket
    return () => {
      socket.disconnect();
    }
  }, [lobbyId, session.status])

  if (view === 'Start' && lobbyData) {
    return <OnlineLobby lobbyData={lobbyData} handleStartLobby={createGame} setView={setView} playersInLobby={playersInLobby} socket={socket} />
  }

  if (lobbyData === null || gameData === null) {
    return <NotFound title="Lobby Not Found" message="This lobby does not seem to exist." />
  }

  if (!lobbyData || !gameData) {
    return <LoadingPage />
  }

  return (
    <StyledGamePage>
      <Meta title={`Online Lobby - GeoHub`} />

      {gameData.mode === 'standard' && (
        <StandardGameView gameData={gameData} setGameData={setGameData} view={view} setView={setView} />
      )}
    </StyledGamePage>
  )
}

OnlineLobbyPage.noLayout = true

export default OnlineLobbyPage
