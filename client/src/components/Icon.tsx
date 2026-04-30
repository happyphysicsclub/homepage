// components/Icon.tsx
// public/svgs/{icon}.svg 파일을 CSS mask로 렌더링합니다.
// 새 SVG를 public/svgs/ 폴더에 추가하면 별도 등록 없이 바로 사용 가능합니다.
//
// 사용 예시:
// <Icon icon="logo" size={32} color="#333" onClick={() => console.log('clicked')} />

import React from 'react'
import classNames from 'classnames'

interface IconProps {
  icon: string
  color?: string
  size?: number
  className?: string
  cotainerStyle?: React.CSSProperties
  motion?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  inline?: boolean
}

export const Icon = ({
  icon,
  color,
  size = 24,
  className,
  cotainerStyle,
  onClick,
  motion = true,
  inline = false,
  ...rest
}: IconProps) => {
  const baseIconClasses = 'flex items-center justify-center cursor-pointer'
  const baseInlineIconClasses = 'inline-flex items-center justify-center cursor-pointer'

  const Element = inline ? 'span' : 'div'

  return (
    <Element
      aria-label={icon}
      style={{ ...cotainerStyle }}
      className={classNames(
        inline ? baseInlineIconClasses : baseIconClasses,
        motion ? 'transition-all duration-200 ease-in-out focus:opacity-50 active:opacity-50 active:scale-90' : '',
      )}
      onClick={onClick}
      {...rest}>
      <span
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          backgroundColor: color ?? 'currentColor',
          maskImage: `url(/svgs/${icon}.svg)`,
          WebkitMaskImage: `url(/svgs/${icon}.svg)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
        className={className}
      />
    </Element>
  )
}
