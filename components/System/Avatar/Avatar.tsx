import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

import { StyledAvatar } from './'

type Props = {
  url: string;
  size?: number;
  mobileSize?: number;
  alt?: string;
  onClick?: any;
  userId?: string;
  outline?: boolean;
  customOutline?: string;
  className?: string;
}

const Avatar: FC<Props> = ({ url, size, mobileSize, alt, onClick, userId, outline, customOutline, className }) => {
  const [currSrc, setCurrSrc] = useState(url || '')
  const fallback = '/images/avatars/fallback.png'

  useEffect(() => {
    setCurrSrc(url)
  }, [url])

  return (
    <StyledAvatar size={size} mobileSize={mobileSize} outline={outline} customOutline={customOutline}>
      <Image 
        src={currSrc || fallback} 
        height={size || 32} 
        width={size || 32} 
        objectFit="cover"
        alt={alt} 
        onError={() => setCurrSrc(fallback)}
        className={className}
      />
    </StyledAvatar>
  )
}

export default Avatar