import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SearchIcon } from './icons'

// Campo fino de pesquisa do header (desktop, tablet e linha extra da Busca no mobile).
// Em /busca mostra o termo da URL; ao navegar para outra página ou termo, volta a refletir a URL.
// Enter e a lupa levam a /busca?q=<termo>; com o campo vazio levam a /busca (sem "?q=" vazio).
export default function SearchField({ className = '' }: { className?: string }) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const termoDaUrl = pathname === '/busca' ? (new URLSearchParams(search).get('q') ?? '') : ''

  // null = mostra o termo da URL. O texto digitado é descartado sempre que a URL muda (inclusive ao voltar no histórico).
  const [digitado, setDigitado] = useState<string | null>(null)
  const [urlAnterior, setUrlAnterior] = useState(pathname + search)
  if (urlAnterior !== pathname + search) {
    setUrlAnterior(pathname + search)
    setDigitado(null)
  }
  const valor = digitado ?? termoDaUrl

  const termo = valor.trim()
  const url = termo ? `/busca?q=${encodeURIComponent(termo)}` : '/busca'

  function enviar(e: FormEvent) {
    e.preventDefault()
    navigate(url)
  }

  return (
    <form
      role="search"
      onSubmit={enviar}
      className={`flex h-11 items-center gap-1 border-b border-silk focus-within:border-b-2 ${className}`}
    >
      <Link to={url} aria-label="Pesquisar" className="-ml-2.5 flex size-11 shrink-0 items-center justify-center text-silk">
        <SearchIcon strokeWidth={1.7} />
      </Link>
      <input
        type="search"
        value={valor}
        onChange={(e) => setDigitado(e.target.value)}
        placeholder="Pesquisar"
        aria-label="Pesquisar no catálogo"
        className="h-11 min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-silk outline-none placeholder:text-oat"
      />
    </form>
  )
}
