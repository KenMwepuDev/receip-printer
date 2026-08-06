/** Inline SVG mark for Café du Port (prints reliably without external fetch). */
export default function StoreLogo({ className = 'receipt__logo' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="72"
      height="72"
      role="img"
      aria-label="Logo Café du Port"
    >
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M28 72c8-22 20-34 32-34s24 12 32 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M40 70h40c2 10-6 18-20 18s-22-8-20-18z"
        fill="currentColor"
      />
      <path
        d="M78 62h8c6 0 10 4 10 10s-4 10-10 10h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="48" cy="42" r="3" fill="currentColor" />
      <circle cx="60" cy="36" r="3" fill="currentColor" />
      <circle cx="72" cy="42" r="3" fill="currentColor" />
    </svg>
  )
}
