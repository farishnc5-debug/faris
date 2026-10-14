type IconProps = { filled?: boolean };

/** Minimal line icons in the spirit of SF Symbols (not the actual Apple asset). */

export function BookIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 0 : 1.8}>
      {filled ? (
        <path
          fill="currentColor"
          d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v18H5.5A1.5 1.5 0 0 1 4 19.5v-15ZM13 3h5.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H13V3Z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5.5C4 4.67 4.67 4 5.5 4H11a1 1 0 0 1 1 1v15a1 1 0 0 1-1-1H5.5A1.5 1.5 0 0 1 4 17.5v-12ZM20 5.5c0-.83-.67-1.5-1.5-1.5H13a1 1 0 0 0-1 1v15a1 1 0 0 1 1-1h5.5a1.5 1.5 0 0 0 1.5-1.5v-12Z"
        />
      )}
    </svg>
  );
}

export function LetterIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3.5" y="5" width="7" height="7" rx="1.5" fill={filled ? "currentColor" : "none"} />
      <rect x="13.5" y="5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="15" width="7" height="4" rx="1.3" />
      <rect x="13.5" y="15" width="7" height="4" rx="1.3" fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}

export function TargetIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="8.2" fill={filled ? "currentColor" : "none"} fillOpacity={filled ? 0.15 : 0} />
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChartIcon({ filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M4.5 20V11M9.5 20V7M14.5 20V13M19.5 20V4"
        strokeLinecap="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 10v4h3.5L13 18V6L7.5 10H4Z" strokeLinejoin="round" />
      <path d="M16.2 9a4.5 4.5 0 0 1 0 6" strokeLinecap="round" />
      <path d="M18.5 6.8a8 8 0 0 1 0 10.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
