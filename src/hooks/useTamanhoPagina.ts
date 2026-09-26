import { useValorPorBreakpoint } from './useValorPorBreakpoint'

// Tamanho de página do Catálogo por breakpoint (2x3, 3x3 e 4x2 produtos, como nos quadros).
export function useTamanhoPagina() {
  return useValorPorBreakpoint(6, 9, 8)
}
