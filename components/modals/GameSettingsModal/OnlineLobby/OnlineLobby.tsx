import { FC, useEffect, useState } from 'react'
import { Input } from '@components/system'
import { CheckIcon, ClipboardIcon } from '@heroicons/react/outline'
import { StyledOnlineLobby } from './'

type Props = {
  lobbyId: string
}

const OnlineLobby: FC<Props> = ({ lobbyId }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const generateUrl = () => {
    const domain = window.location.origin
    const invLink = `${domain}/online-lobby/${lobbyId}`

    setInviteLink(invLink)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setIsCopied(true)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    generateUrl()
  }, [lobbyId])

  if (!inviteLink) return <span>Loading...</span>

  return (
    <StyledOnlineLobby>
      <label className="inputLabel">Invite people with this URL</label>
      <div className="inputWrapper">
        <Input id="invite" type="text" value={inviteLink} readOnly fontSize="15px" />

        <div className="copyBtnWrapper">
          <button className="copyBtn" onClick={() => handleCopy()}>
            {isCopied ? <CheckIcon className="check" /> : <ClipboardIcon />}
          </button>
        </div>
      </div>
    </StyledOnlineLobby>
  )
}

export default OnlineLobby
