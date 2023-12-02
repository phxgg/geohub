import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Game } from '@backend/models'
import { NotFound } from '@components/errorViews'
import { Navbar } from '@components/layout'
import { Meta } from '@components/Meta'
import { ResultMap } from '@components/ResultMap'
import { LeaderboardCard } from '@components/Results'
import { SkeletonGameResults } from '@components/skeletons'
import { StreaksLeaderboard } from '@components/StreaksLeaderboard'
import { StreaksSummaryMap } from '@components/StreaksSummaryMap'
import { Button, FlexGroup } from '@components/system'
import { useAppSelector } from '@redux/hook'
import StyledResultPage from '@styles/ResultPage.Styled'
import { MapType, PageType } from '@types'
import { mailman } from '@utils/helpers'

const OnlineLobbyResultsPage: PageType = () => {
  const [gamesFromLobby, setGamesFromLobby] = useState<Game[] | null>()
  const [mapData, setMapData] = useState<MapType>()
  const [selectedGameIndex, setSelectedGameIndex] = useState(0)
  const [notAuthorized, setNotAuthorized] = useState(false)
  const router = useRouter()
  const lobbyId = router.query.id as string
  const user = useAppSelector((state) => state.user)

  const fetchGames = async () => {
    const res = await mailman(`scores/online-lobbies/${lobbyId}`)

    if (res.error) {
      if (res.error.code === 401) {
        return setNotAuthorized(true)
      }

      return setGamesFromLobby(null)
    }

    setGamesFromLobby(res.games)

    if (res.games.length > 0 && res.games[0].mode === 'standard') {
      fetchMap(res.games[0].mapId)
    }
  }

  const fetchMap = async (mapId: string) => {
    const res = await mailman(`maps/${mapId}`)
    setMapData(res)
  }

  const getDefaultGameToShow = () => {
    const thisUserIndex = gamesFromLobby?.map((game) => game.userId.toString()).indexOf(user?.id)

    if (thisUserIndex && thisUserIndex !== -1) {
      setSelectedGameIndex(thisUserIndex)
    }
  }

  useEffect(() => {
    if (!lobbyId) {
      return
    }

    fetchGames()
  }, [lobbyId])

  useEffect(() => {
    getDefaultGameToShow()
  }, [gamesFromLobby])

  if (notAuthorized) {
    return (
      <StyledResultPage>
        <div className="not-played-wrapper">
          <div className="not-played">
            <h1>You have not played this challenge</h1>
            <p>Finish the challenge to view the results.</p>
            <Link href={`/challenge/${lobbyId}`}>
              <a>
                <Button>Play Lobby</Button>
              </a>
            </Link>
          </div>
        </div>
      </StyledResultPage>
    )
  }

  if (gamesFromLobby === null) {
    return <NotFound message="This lobby does not exist or has not been played yet." />
  }

  return (
    <StyledResultPage>
      <Meta title="Online Lobby Results" />

      {!gamesFromLobby || !mapData ? (
        <SkeletonGameResults />
      ) : (
        <section>
          <Navbar />

          <ResultMap
            guessedLocations={gamesFromLobby[selectedGameIndex].guesses}
            actualLocations={gamesFromLobby[selectedGameIndex].rounds}
            round={gamesFromLobby[selectedGameIndex].round}
            isFinalResults
            isLeaderboard
            userAvatar={gamesFromLobby[selectedGameIndex].userDetails?.avatar}
          />

          <FlexGroup justify="center">
            <LeaderboardCard
              gameData={gamesFromLobby}
              mapData={mapData}
              selectedGameIndex={selectedGameIndex}
              setSelectedGameIndex={setSelectedGameIndex}
            />
          </FlexGroup>
        </section>
      )}
    </StyledResultPage>
  )
}

OnlineLobbyResultsPage.noLayout = true

export default OnlineLobbyResultsPage
