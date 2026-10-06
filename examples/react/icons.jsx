export const ICONS = {
  cursor: <path d="M5.5 3.5 19 11l-6.1 1.6L9.5 19z" />,
  pen: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
  eraser: <>
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
    <path d="M22 21H7" />
    <path d="m5 11 9 9" />
  </>,
  text: <>
    <path d="M5 5h14" />
    <path d="M12 5v14" />
    <path d="M9 19h6" />
  </>,
  line: <path d="M4.5 19.5 19.5 4.5" />,
  rect: <rect x="4" y="5.5" width="16" height="13" rx="1.5" />,
  oval: <ellipse cx="12" cy="12" rx="8" ry="6.5" />,
  tick: <path d="m4.5 12.5 4.8 4.8L19.5 7" />,
  cross: <>
    <path d="M6 6 18 18" />
    <path d="M18 6 6 18" />
  </>,
  undo: <>
    <polyline points="9 14 4 9 9 4" />
    <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
  </>,
  redo: <>
    <polyline points="15 14 20 9 15 4" />
    <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
  </>,
  up: <path d="m6 14.5 6-6 6 6" />,
  down: <path d="m6 9.5 6 6 6-6" />,
  collapse: <path d="m9.5 6 6 6-6 6" />,
  expand: <path d="m14.5 6-6 6 6 6" />,
  camera: <>
    <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
    <path d="M15.5 10.5 21 7.5v9l-5.5-3z" />
  </>,
  minimize: <path d="M6 12h12" />,
  maximize: <rect x="6" y="6" width="12" height="12" rx="1.5" />,
  restore: <>
    <rect x="4.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M8.5 5.5h8a2 2 0 0 1 2 2v8" />
  </>,
  close: <>
    <path d="M6.5 6.5 17.5 17.5" />
    <path d="M17.5 6.5 6.5 17.5" />
  </>,
  windows: <>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17" />
  </>,
  checked: <>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="m8 12.2 2.8 2.8L16.2 9.4" />
  </>,
  unchecked: <rect x="4" y="4" width="16" height="16" rx="4" />,
  reset: <>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
    <path d="M4.5 4v4.5H9" />
  </>,
  trash: <>
    <path d="M4 6.5h16" />
    <path d="M18.5 6.5 17.6 19a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 6.5" />
    <path d="M9.5 6.5V4.6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.9" />
    <path d="M10 10.5v6M14 10.5v6" />
  </>,
  plus: <>
    <path d="M12 5.5v13" />
    <path d="M5.5 12h13" />
  </>,
}

export function Icon({ name, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}
