import { useSyncExternalStore } from 'react'

// Breakpoints do Tailwind: md = 48rem, lg = 64rem.
const MD = '(min-width: 48rem)'
const LG = '(min-width: 64rem)'

function assinar(aoMudar: () => void) {
  const consultas = [window.matchMedia(MD), window.matchMedia(LG)]
  consultas.forEach((c) => c.addEventListener('change', aoMudar))
  return () => consultas.forEach((c) => c.removeEventListener('change', aoMudar))
}

// useSyncExternalStore lê o breakpoint já no primeiro render, sem "piscar" com outro valor.
export function useValorPorBreakpoint(mobile: number, tablet: number, desktop: number) {
  return useSyncExternalStore(assinar, () => {
    if (window.matchMedia(LG).matches) return desktop
    if (window.matchMedia(MD).matches) return tablet
    return mobile
  })
}
