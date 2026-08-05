export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Shopping India">
      {/* Shopping bag icon */}
      <rect x="2" y="10" width="30" height="32" rx="4" fill="#d8ef72" />
      <rect x="7" y="4" width="20" height="10" rx="5" stroke="#d8ef72" strokeWidth="3" fill="none" />
      <circle cx="17" cy="24" r="3" fill="#1c2734" />
      <path d="M12 30 h10" stroke="#1c2734" strokeWidth="2" strokeLinecap="round" />

      {/* "Shopping" text */}
      <text x="42" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" fill="white" letterSpacing="-0.5">
        Shopping
      </text>

      {/* "India" text */}
      <text x="178" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" fill="#d8ef72" letterSpacing="-0.5">
        India
      </text>

      {/* Tagline */}
      <text x="42" y="42" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500" fontSize="7.5" fill="rgba(255,255,255,0.5)" letterSpacing="2.5">
        YOUR ONLINE MARKETPLACE
      </text>
    </svg>
  );
}
