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
import { OnlineLobbyType, GameViewType, PageType } from '@types'
import { mailman, showToast } from '@utils/helpers'
import { OnlineLobby } from '@components/OnlineLobby'

const OnlineLobbyPage: PageType = () => {
  const [view, setView] = useState<GameViewType>('Game')
  const [lobbyData, setLobbyData] = useState<OnlineLobbyType | null>()
  const [gameData, setGameData] = useState<Game | null>()

  const router = useRouter()
  const lobbyId = router.query.id as string
  const dispatch = useAppDispatch()

  const fetchChallenge = async () => {
    const res = await mailman(`online-lobbies/${lobbyId}`)

    const { lobbyBelongsToUser, playersGame, mapDetails } = res

    // If challenge not found -> show error page
    if (res.error) {
      return setLobbyData(null)
    }

    setLobbyData(res)

    // If the user has not started the challenge yet
    if (!playersGame) {
      return lobbyBelongsToUser ? await createGame(res) : setView('Start')
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

    if (view === 'Game') {
      fetchChallenge()
    }
  }, [lobbyId])

  if (view === 'Start' && lobbyData) {
    return <OnlineLobby lobbyData={lobbyData} handleStartLobby={createGame} setView={setView} />
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
