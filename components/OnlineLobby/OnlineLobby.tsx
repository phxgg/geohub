import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { Avatar } from '@components/system'
import {
  ArrowsExpandIcon,
  ClockIcon,
  LocationMarkerIcon,
  SwitchHorizontalIcon,
  UserGroupIcon,
  ZoomInIcon,
} from '@heroicons/react/outline'
import { useAppSelector } from '@redux/hook'
import { OnlineLobbyType, GameViewType, PlayerInLobbyType } from '@types'
import { MAP_AVATAR_PATH } from '@utils/constants/random'
import { formatTimeLimit, redirectToRegister } from '@utils/helpers'
import { StyledOnlineLobby } from '.'
import { OnlineLobby as OnlineLobbyInvite } from '@components/modals/GameSettingsModal/OnlineLobby'
import Link from 'next/link'

type Props = {
  lobbyData: OnlineLobbyType
  handleStartLobby: (lobbyData: OnlineLobbyType) => void
  setView: (view: GameViewType) => void
  playersInLobby: PlayerInLobbyType[]
  socket: any
}

const OnlineLobby: FC<Props> = ({ lobbyData, handleStartLobby, setView, playersInLobby, socket }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const user = useAppSelector((state) => state.user)
  const router = useRouter()

  const CAN_MOVE = lobbyData.gameSettings.canMove
  const CAN_PAN = lobbyData.gameSettings.canPan
  const CAN_ZOOM = lobbyData.gameSettings.canZoom
  const HAS_TIME_LIMIT = lobbyData.gameSettings.timeLimit !== 0
  const TIME_LIMIT = lobbyData.gameSettings.timeLimit

  useEffect(() => {
    if (!user.id) {
      setIsLoggedIn(false)
    }
  }, [])

  const handleButtonClick = async () => {
    if (isLoggedIn) {
      handleStartLobby(lobbyData)
      setView('Game')
    } else {
      redirectToRegister(router)
    }
  }

  return (
    <StyledOnlineLobby>
      <div className="onlineLobbyWrapper">
        <Image
          src={`${MAP_AVATAR_PATH}/${lobbyData?.mapDetails?.previewImg}`}
          alt=""
          layout="fill"
          objectFit="cover"
          style={{ opacity: 0.12 }}
        />

        <div className="map-name">
          <LocationMarkerIcon />
          <span>{lobbyData.mapDetails?.name}</span>
        </div>

        <div className="returnHome">
            <Link href="/">
              <a>Return Home</a>
            </Link>
          </div>
        <div className="onlineLobbyContent">
          <h1 className="lobbyTitle">
            Online Lobby
          </h1>
          <div className="lobbyCreator">
            <Avatar
              type="user"
              src={lobbyData.creatorAvatar.emoji}
              backgroundColor={lobbyData.creatorAvatar.color}
            />
            <div className="lobbyMessage">
              <span className="emphasizedText">{lobbyData.creatorName}</span>
              <span> challenged you to play </span>
              <span className="emphasizedText">
                {lobbyData?.mapDetails?.name}
              </span>
            </div>
          </div>

          <button className="lobbyBtn" onClick={() => handleButtonClick()}>
            {isLoggedIn ? 'Play Game' : 'Create Account'}
          </button>

          {isLoggedIn && (
            <OnlineLobbyInvite lobbyId={lobbyData._id as string}></OnlineLobbyInvite>
          )}
        </div>
      </div>

      <div className="lobbySettings">
        <div className="settingsItem">
          <ClockIcon color={!HAS_TIME_LIMIT ? 'var(--green-300)' : '#888'} />

          {HAS_TIME_LIMIT ? `${formatTimeLimit(TIME_LIMIT)} per round` : 'No Time Limit'}
        </div>

        <div className="settingsItem">
          <ArrowsExpandIcon color={CAN_MOVE ? 'var(--green-300)' : '#888'} />

          {CAN_MOVE ? 'Moving Allowed' : 'No Move'}
        </div>

        <div className="settingsItem">
          <SwitchHorizontalIcon color={CAN_PAN ? 'var(--green-300)' : '#888'} />

          {CAN_PAN ? 'Panning Allowed' : 'No Pan'}
        </div>

        <div className="settingsItem">
          <ZoomInIcon color={CAN_ZOOM ? 'var(--green-300)' : '#888'} />

          {CAN_ZOOM ? 'Zooming Allowed' : 'No Zoom'}
        </div>

        {isLoggedIn && (
          <div className="settingsItem">
            <UserGroupIcon color="var(--green-300)" />
            {playersInLobby.length} player{playersInLobby.length > 1 ? 's' : ''} in lobby
          </div>
        )}
      </div>

      <div className="playersInLobby">
        <h2>Players in Lobby</h2>
        {isLoggedIn ? (
          <ul>
            {playersInLobby.map((player) => (
              <li key={player.id}>
                <Avatar
                  type="user"
                  src={player.avatar.emoji}
                  backgroundColor={player.avatar.color}
                />
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="notLoggedIn">
            <span>Log in to see who{'\''}s in the lobby</span>
          </div>
        )}
      </div>
    </StyledOnlineLobby>
  )
}

export default OnlineLobby
