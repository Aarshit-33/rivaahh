// Small line-icon set (24px grid) so the section needs no icon font.
const PATHS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4ZM10 21h4',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7Z',
  cake: 'M4 21h16M5 21v-7h14v7M5 17c2 1 3-1 4.7 0s3 1 4.6 0 3-1 4.7 0M12 14v-3M12 8c-1-1 0-3 0-3s1 2 0 3',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4ZM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  chat: 'M4 5h16v11H9l-5 4Z',
  check: 'M5 12.5 9.5 17 19 7',
  child: 'M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 21v-5a5 5 0 0 1 10 0v5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  close: 'M6 6l12 12M18 6 6 18',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  heart: 'M12 20s-7-4.4-9-9a4.7 4.7 0 0 1 9-2.6A4.7 4.7 0 0 1 21 11c-2 4.6-9 9-9 9Z',
  home: 'M3 11l9-7 9 7M5 10v10h14V10',
  lock: 'M5 11h14v10H5ZM8 11V8a4 4 0 0 1 8 0v3',
  music: 'M9 18V5l11-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  nav: 'M12 2l7 19-7-4-7 4Z',
  parking: 'M4 3h16v18H4ZM10 17V7h3.5a3 3 0 0 1 0 6H10',
  pause: 'M9 5v14M15 5v14',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  photo: 'M3 5h18v14H3ZM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 16l-5-5-8 8',
  pin: 'M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12ZM12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z',
  play: 'M8 5l11 7-11 7Z',
  send: 'M3 11l18-8-8 18-2-8Z',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9Z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  upload: 'M12 20V9M7 14l5-5 5 5M5 4h14',
}

const FILLED = new Set(['play'])

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={FILLED.has(name) ? 'currentColor' : 'none'}
      stroke={FILLED.has(name) ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
