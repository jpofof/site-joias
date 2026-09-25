import type { ReactNode } from 'react'

type IconProps = { size?: number; strokeWidth?: number }

function Icon({ size = 22, strokeWidth = 1.5, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h16" />
    <path d="M4 16h16" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Icon>
)

export const CartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </Icon>
)
