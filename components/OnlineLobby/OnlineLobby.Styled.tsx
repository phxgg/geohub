import styled from 'styled-components'

type StyledProps = {}

const StyledOnlineLobby = styled.div<StyledProps>`
  .onlineLobbyWrapper {
    height: 300px;
    padding: 4rem 1rem;
    border-bottom: 1px solid #222;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 0px 2px rgba(0, 0, 0, 0.9);
    width: 100%;
    background-color: #0e0e0e;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .onlineLobbyImg {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      opacity: 0.12;
      object-fit: cover;
    }

    .map-name {
      position: absolute;
      bottom: 8px;
      right: 10px;
      background-color: rgba(255, 255, 255, 0.05);
      padding: 8px 16px 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dcdcdc;

      svg {
        height: 20px;
        margin-right: 6px;
      }

      span {
        margin-top: 2px;
      }
    }

    .onlineLobbyContent {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 1.5rem;
      z-index: 1;
      position: absolute;
    }
  }

  .lobbyTitle {
    font-size: 2.5rem;
    font-style: italic;
    text-align: center;

    @media (max-width: 600px) {
      font-size: 1.5rem;
    }
  }

  .lobbyCreator {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .lobbyMessage {
      margin-left: 8px;
      color: var(--color2);

      .emphasizedText {
        color: #e4e4e4;
        font-weight: 600;
      }

      @media (max-width: 600px) {
        font-size: 0.875rem;
      }
    }
  }

  .lobbyBtn {
    padding: 1rem 3rem;
    border-radius: 50rem;
    background-color: var(--mediumPurple);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 1rem;
    font-weight: 500;

    :hover {
      background-color: var(--indigo-600);
      transform: scale(1.02);
    }
  }

  .lobbySettings {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 10px;
    flex-wrap: wrap;
  }

  .playersInLobby {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 10px;
    flex-wrap: wrap;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 200px;
        border: 1px solid #202020;
        border-radius: 6px;
        padding: 16px 0;
        background-color: #252525;
        font-size: 14px;

        @media (max-width: 600px) {
          width: 160px;
          font-size: 12px;
        }

        svg {
          height: 24px;

          path {
            stroke-width: 1.5;
          }
        }
      }
    }
  }

  .settingsItem {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 200px;
    border: 1px solid #202020;
    border-radius: 6px;
    padding: 16px 0;
    background-color: #252525;
    font-size: 14px;

    @media (max-width: 600px) {
      width: 160px;
      font-size: 12px;
    }

    svg {
      height: 24px;

      path {
        stroke-width: 1.5;
      }
    }
  }

  .notLoggedIn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    color: #888;
    font-size: 14px;
  }

  .returnHome {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 8px 16px 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dcdcdc;
    background-color: rgba(255, 255, 255, 0.05);
    cursor: pointer;

    svg {
      height: 20px;
      margin-right: 6px;
    }

    span {
      margin-top: 2px;
    }
  }

  .isReady {
    background-color: var(--green-500);
    border: 1px solid var(--green-500);
    :hover {
      background-color: var(--green-600);
    }
  }
`

export default StyledOnlineLobby
