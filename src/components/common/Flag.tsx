/**
 * Small inline SVG flags (emoji flags don't render on Windows).
 * 3:2 aspect, rounded corners, hairline border so light flags read on light UI.
 */
export function Flag({ code, width = 20 }: { code: 'vi' | 'en'; width?: number }) {
  const height = Math.round((width * 2) / 3)
  return (
    <svg
      viewBox="0 0 30 20"
      width={width}
      height={height}
      aria-hidden
      className="shrink-0 rounded-[3px] ring-1 ring-black/10 dark:ring-white/15"
    >
      <defs>
        <clipPath id={`flag-${code}`}>
          <rect width="30" height="20" rx="2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-${code})`}>
        {code === 'vi' ? (
          <>
            <rect width="30" height="20" fill="#DA251D" />
            <polygon
              fill="#FFFF00"
              points="15,4 16.18,7.62 19.98,7.62 16.9,9.86 18.08,13.48 15,11.24 11.92,13.48 13.1,9.86 10.02,7.62 13.82,7.62"
            />
          </>
        ) : (
          // United Kingdom (Union Jack, simplified)
          <>
            <rect width="30" height="20" fill="#012169" />
            <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFF" strokeWidth="4" />
            <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.6" />
            <path d="M15,0 V20 M0,10 H30" stroke="#FFF" strokeWidth="6" />
            <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.4" />
          </>
        )}
      </g>
    </svg>
  )
}
