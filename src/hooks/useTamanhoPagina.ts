import { useSyncExternalStore } from 'react'

// Tamanho de página do Catálogo por breakpoint (2x3, 3x3 e 4x2 produtos, como nos quadros).
const MD = '(min-width: 48rem)'
const LG = '(min-width: 64rem)'

function assinar(aoMudar: () => void) {
  const consultas = [window.matchMedia(MD), window.matchMedia(LG)]
  consultas.forEach((c) => c.addEventListener('change', aoMudar))
  return () => consultas.forEach((c) => c.removeEventListener('change', aoMudar))
}

function tamanhoAtual() {
  if (window.matchMedia(LG).matches) return 8
  if (window.matchMedia(MD).matches) return 9
  return 6
}

// useSyncExternalStore lê o breakpoint já no primeiro render, sem "piscar" com outro tamanho.
export function useTamanhoPagina() {
  return useSyncExternalStore(assinar, tamanhoAtual)
}
