import type { ReactNode } from 'react'

interface BoardProps {
  /** Silkscreen reference printed along the right edge, e.g. "P-01 · REV A". */
  silk?: string
  tone?: 'peach' | 'sea' | 'neutral'
  /** Gold edge-connector fingers along the bottom edge. */
  pins?: boolean
  className?: string
  children: ReactNode
  onClick?: () => void
  onMouseEnter?: () => void
}

/**
 * A card styled as a small circuit board: solder-mask fill, copper-ringed mounting
 * holes in the corners, a dashed silkscreen outline, a reference designator and
 * optional gold edge pins. Colour comes on when the region is powered.
 */
export default function Board({ silk, tone = 'neutral', pins, className = '', children, onClick, onMouseEnter }: BoardProps) {
  return (
    <div
      className={`board ${tone !== 'neutral' ? `tone-${tone}` : ''} ${pins ? 'has-pins' : ''} ${className}`}
      data-silk={silk}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
      <span className="board-holes" aria-hidden />
      {pins && <span className="board-pins" aria-hidden />}
    </div>
  )
}
