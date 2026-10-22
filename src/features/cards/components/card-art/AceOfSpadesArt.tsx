export function AceOfSpadesArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={`ace-spades-art ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {/* Subtle radial shading for the Ace */}
        <radialGradient id="spadeGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#2b282c" />
          <stop offset="100%" stopColor="#141315" />
        </radialGradient>
        {/* Gold accents gradient */}
        <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#edd48b" />
          <stop offset="50%" stopColor="#c59837" />
          <stop offset="100%" stopColor="#8d661b" />
        </linearGradient>
      </defs>

      {/* Decorative background aura / rays */}
      <g opacity="0.18" stroke="#a3823f" strokeWidth="1">
        <line x1="100" y1="20" x2="100" y2="200" strokeDasharray="3 4" />
        <line x1="30" y1="110" x2="170" y2="110" strokeDasharray="3 4" />
        <circle cx="100" cy="110" r="75" fill="none" strokeWidth="0.8" strokeDasharray="2 4" />
        <circle cx="100" cy="110" r="88" fill="none" strokeWidth="0.5" />
      </g>

      {/* Main Spade Silhouette */}
      <path
        d="M 100 18 C 93 42 56 82 24 110 C 8 124 12 144 32 146 C 60 148 84 130 88 118 C 88 138 76 170 64 198 L 136 198 C 124 170 112 138 112 118 C 116 130 140 148 168 146 C 188 144 192 124 176 110 C 144 82 107 42 100 18 Z"
        fill="url(#spadeGlow)"
        stroke="#1a181b"
        strokeWidth="2.5"
      />

      {/* Outer gold filigree border of the spade */}
      <path
        d="M 100 28 C 94 48 62 84 34 108 C 22 119 25 134 40 136 C 62 138 82 122 86 112 C 87 134 76 166 68 190 L 132 190 C 124 166 113 134 114 112 C 118 122 138 138 160 136 C 175 134 178 119 166 108 C 138 84 106 48 100 28 Z"
        fill="none"
        stroke="url(#goldFiligree)"
        strokeWidth="1.6"
        opacity="0.9"
      />

      {/* Inner ornamental filigree & scrollwork */}
      <g stroke="url(#goldFiligree)" fill="none" strokeLinecap="round">
        {/* Central spine fleur */}
        <path d="M 100 42 Q 100 70 100 100" strokeWidth="1.8" />
        <path d="M 100 48 Q 90 60 85 75 Q 82 85 92 86 Q 98 86 98 78" strokeWidth="1.2" />
        <path d="M 100 48 Q 110 60 115 75 Q 118 85 108 86 Q 102 86 102 78" strokeWidth="1.2" />

        {/* Acanthus scrolls left side */}
        <path d="M 92 90 C 72 88 56 98 50 114 C 47 122 55 128 62 124 C 68 120 74 108 88 108" strokeWidth="1.2" />
        <path d="M 65 102 C 58 108 52 118 58 122" strokeWidth="1" />
        <path d="M 78 82 C 60 92 42 108 40 120" strokeWidth="0.8" strokeDasharray="1.5 2" />

        {/* Acanthus scrolls right side (symmetrical) */}
        <path d="M 108 90 C 128 88 144 98 150 114 C 153 122 145 128 138 124 C 132 120 126 108 112 108" strokeWidth="1.2" />
        <path d="M 135 102 C 142 108 148 118 142 122" strokeWidth="1" />
        <path d="M 122 82 C 140 92 158 108 160 120" strokeWidth="0.8" strokeDasharray="1.5 2" />

        {/* Stem ornamental lines */}
        <path d="M 85 152 Q 100 156 115 152" strokeWidth="1.2" />
        <path d="M 80 172 Q 100 176 120 172" strokeWidth="1.2" />
        <line x1="100" y1="130" x2="100" y2="185" strokeWidth="1.4" />
      </g>

      {/* Central Rosette / Medallion */}
      <g transform="translate(100, 105)">
        <circle cx="0" cy="0" r="14" fill="#141315" stroke="url(#goldFiligree)" strokeWidth="1.5" />
        {/* 8-pointed star in center */}
        <polygon
          points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3"
          fill="url(#goldFiligree)"
        />
        <circle cx="0" cy="0" r="2.5" fill="#fffdfa" />
      </g>

      {/* Decorative ribbons & bottom flourish */}
      <g stroke="url(#goldFiligree)" fill="none" opacity="0.8">
        <path d="M 68 206 Q 100 214 132 206" strokeWidth="1.5" />
        <path d="M 60 210 Q 100 220 140 210" strokeWidth="0.8" />
        <circle cx="100" cy="214" r="2.5" fill="url(#goldFiligree)" />
      </g>
    </svg>
  );
}
