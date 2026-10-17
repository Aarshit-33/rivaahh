// Small drawn icons for the showcase controls: one 1.6px stroke, round caps.
// Decorative: every button that uses one also carries a visible label or an
// aria-label.

const Svg = ({ children, size = 18, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

export const PlayIcon = (p) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />
  </Svg>
)

export const PauseIcon = (p) => (
  <Svg {...p}>
    <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth="2.6" />
  </Svg>
)

export const RestartIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4.5v4h4" />
  </Svg>
)

export const ExpandIcon = (p) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5 13.5 10.5M4.5 19.5l6-6" />
  </Svg>
)

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const HeartIcon = ({ on, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
      fill={on ? 'currentColor' : 'none'}
    />
  </Svg>
)

export const ShareIcon = (p) => (
  <Svg {...p}>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M6 12.5v6A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5v-6" />
  </Svg>
)

export const PenIcon = (p) => (
  <Svg {...p}>
    <path d="M15.5 5.5l3 3L9 18l-4 1 1-4z" />
    <path d="M13.5 7.5l3 3" />
  </Svg>
)

export const ChevronIcon = ({ dir = 'right', ...p }) => (
  <Svg {...p}>
    <path d={dir === 'right' ? 'M9.5 5.5 16 12l-6.5 6.5' : 'M14.5 5.5 8 12l6.5 6.5'} />
  </Svg>
)

export const CopyIcon = (p) => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </Svg>
)

export const PhoneIcon = (p) => (
  <Svg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2.2" />
    <path d="M10.5 6h3" />
  </Svg>
)

export const LaptopIcon = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="5" width="15" height="10" rx="1.4" />
    <path d="M2.5 18.5h19" />
  </Svg>
)

export const ArrowIcon = ({ dir = 'down', ...p }) => (
  <Svg {...p}>
    <path d={dir === 'down' ? 'M12 5v14M6.5 13.5 12 19l5.5-5.5' : 'M12 19V5M6.5 10.5 12 5l5.5 5.5'} />
  </Svg>
)
