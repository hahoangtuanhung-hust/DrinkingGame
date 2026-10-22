import { useId } from "react";
import type { Suit } from "../../types";
import { isRedSuit, SuitIcon } from "./SuitIcon";

interface CourtCardArtProps {
  rank: "J" | "Q" | "K";
  suit: Suit;
  className?: string;
}

export function CourtCardArt({ rank, suit, className = "" }: CourtCardArtProps) {
  const uniqueId = useId().replace(/:/g, "");
  const red = isRedSuit(suit);

  // Palette tailored to red vs black suits
  const royalRed = red ? "#b81d24" : "#981a20";
  const royalNavy = red ? "#1d3252" : "#14253f";
  const royalGold = "#d99b26";
  const goldLight = "#f3c759";
  const inkDark = "#181619";
  const skinTone = "#fceee0";
  const whiteTone = "#fffdf9";

  const halfId = `court-half-${uniqueId}`;

  return (
    <svg
      viewBox="0 0 200 270"
      className={`court-card-art court-card-art--${rank.toLowerCase()} ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {/* Frame clip path to keep illustration inside portrait border */}
        <clipPath id={`court-clip-${uniqueId}`}>
          <rect x="8" y="8" width="184" height="254" rx="4" />
        </clipPath>

        {/* Reversible Half Definition */}
        <g id={halfId}>
          {rank === "K" && (
            <KingHalf
              suit={suit}
              royalRed={royalRed}
              royalNavy={royalNavy}
              royalGold={royalGold}
              goldLight={goldLight}
              inkDark={inkDark}
              skinTone={skinTone}
              whiteTone={whiteTone}
            />
          )}
          {rank === "Q" && (
            <QueenHalf
              suit={suit}
              royalRed={royalRed}
              royalNavy={royalNavy}
              royalGold={royalGold}
              goldLight={goldLight}
              inkDark={inkDark}
              skinTone={skinTone}
              whiteTone={whiteTone}
            />
          )}
          {rank === "J" && (
            <JackHalf
              suit={suit}
              royalRed={royalRed}
              royalNavy={royalNavy}
              royalGold={royalGold}
              goldLight={goldLight}
              inkDark={inkDark}
              skinTone={skinTone}
              whiteTone={whiteTone}
            />
          )}
        </g>
      </defs>

      {/* Portrait Background */}
      <rect
        x="6"
        y="6"
        width="188"
        height="258"
        rx="5"
        fill="#faf6ee"
        stroke={inkDark}
        strokeWidth="2"
      />

      {/* Inner Decorative Gold Border */}
      <rect
        x="10"
        y="10"
        width="180"
        height="250"
        rx="3"
        fill="none"
        stroke={royalGold}
        strokeWidth="1.2"
      />
      <rect
        x="12"
        y="12"
        width="176"
        height="246"
        rx="2"
        fill="none"
        stroke={inkDark}
        strokeWidth="0.8"
      />

      {/* Clustered Court Art (Top + Inverted Bottom) */}
      <g clipPath={`url(#court-clip-${uniqueId})`}>
        {/* Top Half */}
        <use href={`#${halfId}`} />

        {/* Bottom Inverted Half (Reversible 180° rotation around center: x=100, y=135) */}
        <use href={`#${halfId}`} transform="rotate(180 100 135)" />

        {/* Central Divider Bar */}
        <g transform="translate(0, 131)">
          {/* Main divider band */}
          <rect x="8" y="0" width="184" height="8" fill="#e8ded0" stroke={inkDark} strokeWidth="1.2" />
          <line x1="8" y1="4" x2="192" y2="4" stroke={royalGold} strokeWidth="1.6" />
          {/* Center decorative diamond */}
          <polygon points="100,0 106,4 100,8 94,4" fill={royalRed} stroke={inkDark} strokeWidth="1" />
          <polygon points="50,1 54,4 50,7 46,4" fill={royalNavy} stroke={inkDark} strokeWidth="0.8" />
          <polygon points="150,1 154,4 150,7 146,4" fill={royalNavy} stroke={inkDark} strokeWidth="0.8" />
        </g>
      </g>

      {/* Corner Miniature Suit Shields inside the portrait */}
      <g transform="translate(14, 14)">
        <rect x="0" y="0" width="18" height="18" rx="3" fill="#fffdf9" stroke={inkDark} strokeWidth="0.8" />
        <g transform="translate(1, 1)">
          <SuitIcon suit={suit} size={16} />
        </g>
      </g>
      <g transform="translate(168, 238)">
        <rect x="0" y="0" width="18" height="18" rx="3" fill="#fffdf9" stroke={inkDark} strokeWidth="0.8" />
        <g transform="translate(1, 1) rotate(180 8 8)">
          <SuitIcon suit={suit} size={16} />
        </g>
      </g>
    </svg>
  );
}

interface CourtHalfProps {
  suit: Suit;
  royalRed: string;
  royalNavy: string;
  royalGold: string;
  goldLight: string;
  inkDark: string;
  skinTone: string;
  whiteTone: string;
}

/* =========================================================================
   KING (K / Già) - Crown, royal beard, ermine cloak, raised broadsword
   ========================================================================= */
function KingHalf({
  suit,
  royalRed,
  royalNavy,
  royalGold,
  goldLight,
  inkDark,
  skinTone,
  whiteTone,
}: CourtHalfProps) {
  return (
    <g>
      {/* Background drapery / backdrop inside court */}
      <rect x="12" y="12" width="176" height="120" fill="#f4ebd9" />
      <path d="M 12 12 L 50 132 L 12 132 Z" fill={royalNavy} opacity="0.12" />
      <path d="M 188 12 L 150 132 L 188 132 Z" fill={royalRed} opacity="0.12" />

      {/* Broad Royal Robes / Mantle Base */}
      <path
        d="M 32 132 L 36 68 Q 60 76 100 76 Q 140 76 164 68 L 168 132 Z"
        fill={royalRed}
        stroke={inkDark}
        strokeWidth="1.5"
      />

      {/* Heraldic Brocade Patterns on Robe */}
      <g stroke={royalGold} strokeWidth="1.5" fill="none">
        <path d="M 44 80 L 70 132" />
        <path d="M 58 76 L 86 132" />
        <path d="M 156 80 L 130 132" />
        <path d="M 142 76 L 114 132" />
      </g>

      {/* Ermine Fur Collar / Mantle */}
      <path
        d="M 50 64 C 62 82 82 88 100 88 C 118 88 138 82 150 64 C 160 88 144 116 100 116 C 56 116 40 88 50 64 Z"
        fill={whiteTone}
        stroke={inkDark}
        strokeWidth="1.5"
      />
      {/* Ermine black spots */}
      <g fill={inkDark}>
        <polygon points="76,82 78,88 74,88" />
        <polygon points="100,94 102,100 98,100" />
        <polygon points="124,82 126,88 122,88" />
      </g>

      {/* Royal Chest Plate / Chain of Office with Suit Crest */}
      <circle cx="100" cy="116" r="13" fill={royalGold} stroke={inkDark} strokeWidth="1.5" />
      <circle cx="100" cy="116" r="10" fill={whiteTone} />
      <g transform="translate(93, 109)">
        <SuitIcon suit={suit} size={14} />
      </g>

      {/* Royal Raised Sword & Arm (Left side of King) */}
      {/* Sword blade */}
      <polygon
        points="34,14 40,14 42,76 32,76"
        fill="#e2e8f0"
        stroke={inkDark}
        strokeWidth="1.3"
      />
      <line x1="37" y1="14" x2="37" y2="76" stroke="#94a3b8" strokeWidth="1" />
      {/* Crossguard */}
      <rect x="25" y="74" width="24" height="6" rx="2" fill={royalGold} stroke={inkDark} strokeWidth="1.2" />
      {/* Grip & Pommel */}
      <rect x="34" y="80" width="6" height="12" fill={royalNavy} stroke={inkDark} strokeWidth="1" />
      <circle cx="37" cy="94" r="4.5" fill={royalGold} stroke={inkDark} strokeWidth="1.2" />
      {/* Arm holding the sword */}
      <path
        d="M 28 88 C 22 96 26 112 36 116 L 50 114 C 44 104 42 94 38 86 Z"
        fill={royalNavy}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      {/* Hand cuff */}
      <ellipse cx="37" cy="85" rx="5" ry="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />

      {/* Scepter / Ornate Scroll (Right side of King) */}
      <line x1="162" y1="50" x2="162" y2="124" stroke={royalGold} strokeWidth="3" />
      <circle cx="162" cy="48" r="6" fill={royalGold} stroke={inkDark} strokeWidth="1.2" />
      <path
        d="M 154 94 C 158 88 168 88 172 96 L 168 116 C 160 116 154 108 154 94 Z"
        fill={royalNavy}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      <circle cx="162" cy="94" r="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />

      {/* King's Hair & Beard */}
      {/* Royal hair framing cheeks */}
      <path
        d="M 66 40 C 60 52 62 76 72 82 C 78 80 80 72 78 62 C 80 50 78 40 66 40 Z"
        fill="#e8d3b5"
        stroke={inkDark}
        strokeWidth="1.2"
      />
      <path
        d="M 134 40 C 140 52 138 76 128 82 C 122 80 120 72 122 62 C 120 50 122 40 134 40 Z"
        fill="#e8d3b5"
        stroke={inkDark}
        strokeWidth="1.2"
      />

      {/* Face */}
      <ellipse cx="100" cy="50" rx="20" ry="22" fill={skinTone} stroke={inkDark} strokeWidth="1.5" />

      {/* Royal Eyes & Brows */}
      <path d="M 88 43 Q 94 40 98 43" stroke={inkDark} strokeWidth="1.4" fill="none" />
      <path d="M 102 43 Q 106 40 112 43" stroke={inkDark} strokeWidth="1.4" fill="none" />
      <circle cx="93" cy="47" r="1.8" fill={inkDark} />
      <circle cx="107" cy="47" r="1.8" fill={inkDark} />
      {/* Nose */}
      <path d="M 100 45 L 98 55 L 102 55" stroke={inkDark} strokeWidth="1.2" fill="none" />

      {/* Royal Mustache & Beard */}
      <path
        d="M 86 57 Q 100 55 100 62 Q 100 55 114 57 Q 118 64 110 65 Q 100 64 100 67 Q 100 64 90 65 Q 82 64 86 57 Z"
        fill="#dfbe8a"
        stroke={inkDark}
        strokeWidth="1.3"
      />
      {/* Full Beard */}
      <path
        d="M 84 63 C 86 78 94 88 100 90 C 106 88 114 78 116 63 C 112 68 108 72 100 72 C 92 72 88 68 84 63 Z"
        fill="#dfbe8a"
        stroke={inkDark}
        strokeWidth="1.3"
      />
      {/* Beard texture lines */}
      <path d="M 96 74 L 96 86" stroke={inkDark} strokeWidth="0.9" />
      <path d="M 104 74 L 104 86" stroke={inkDark} strokeWidth="0.9" />

      {/* Imperial Crown */}
      {/* Velvet Cap inside crown */}
      <path d="M 76 32 Q 100 16 124 32 Z" fill={royalRed} stroke={inkDark} strokeWidth="1.2" />
      {/* Crown base band */}
      <rect x="74" y="28" width="52" height="9" rx="1.5" fill={royalGold} stroke={inkDark} strokeWidth="1.4" />
      {/* Jewels on band */}
      <circle cx="82" cy="32.5" r="2" fill={royalRed} stroke={inkDark} strokeWidth="0.6" />
      <circle cx="100" cy="32.5" r="2.2" fill={royalNavy} stroke={inkDark} strokeWidth="0.6" />
      <circle cx="118" cy="32.5" r="2" fill={royalRed} stroke={inkDark} strokeWidth="0.6" />
      {/* Crown Spires / Fleur-de-lis peaks */}
      {/* Center spire */}
      <polygon points="100,16 95,28 105,28" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="100" cy="15" r="2.2" fill={goldLight} stroke={inkDark} strokeWidth="0.8" />
      {/* Left spire */}
      <polygon points="82,20 78,28 87,28" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="82" cy="19" r="1.8" fill={goldLight} stroke={inkDark} strokeWidth="0.8" />
      {/* Right spire */}
      <polygon points="118,20 113,28 122,28" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="118" cy="19" r="1.8" fill={goldLight} stroke={inkDark} strokeWidth="0.8" />
    </g>
  );
}

/* =========================================================================
   QUEEN (Q / Đầm) - Tiara, royal veil, brocade gown, holding royal rose
   ========================================================================= */
function QueenHalf({
  suit,
  royalRed,
  royalNavy,
  royalGold,
  goldLight,
  inkDark,
  skinTone,
  whiteTone,
}: CourtHalfProps) {
  return (
    <g>
      {/* Background drapery */}
      <rect x="12" y="12" width="176" height="120" fill="#f6efe1" />
      <path d="M 12 12 Q 60 70 12 132 Z" fill={royalRed} opacity="0.12" />
      <path d="M 188 12 Q 140 70 188 132 Z" fill={royalNavy} opacity="0.12" />

      {/* Royal Robes & Bodice Base */}
      <path
        d="M 34 132 C 38 78 54 70 100 70 C 146 70 162 78 166 132 Z"
        fill={royalNavy}
        stroke={inkDark}
        strokeWidth="1.5"
      />

      {/* Bodice Inset - Chevron Gold & Crimson Brocade */}
      <polygon
        points="100,72 74,132 126,132"
        fill={royalRed}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      <g stroke={royalGold} strokeWidth="1.5" fill="none">
        <path d="M 88 100 L 100 110 L 112 100" />
        <path d="M 82 116 L 100 126 L 118 116" />
        <line x1="100" y1="72" x2="100" y2="132" strokeWidth="1.2" />
      </g>

      {/* Ermine Collar & Mantle Drapes */}
      <path
        d="M 58 66 C 70 82 85 86 100 86 C 115 86 130 82 142 66 C 148 84 136 102 100 102 C 64 102 52 84 58 66 Z"
        fill={whiteTone}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      {/* Ermine spots */}
      <polygon points="80,80 82,85 78,85" fill={inkDark} />
      <polygon points="120,80 122,85 118,85" fill={inkDark} />

      {/* Queen's Royal Pendant with Suit Crest */}
      <circle cx="100" cy="98" r="9" fill={royalGold} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="100" cy="98" r="7" fill={whiteTone} />
      <g transform="translate(94, 92)">
        <SuitIcon suit={suit} size={12} />
      </g>

      {/* Queen's Raised Hand Holding a Royal Flower / Rose */}
      {/* Flower stem & leaves */}
      <path d="M 46 72 Q 44 94 48 116" stroke="#2e7d32" strokeWidth="2" fill="none" />
      <path d="M 44 88 Q 36 84 40 80" stroke="#2e7d32" strokeWidth="1.5" fill="#4caf50" />
      {/* Tudor Rose Blossom */}
      <g transform="translate(46, 68)">
        <circle cx="0" cy="0" r="9" fill={royalRed} stroke={inkDark} strokeWidth="1.2" />
        <circle cx="0" cy="0" r="6" fill={goldLight} stroke={inkDark} strokeWidth="0.8" />
        <circle cx="0" cy="0" r="3" fill={royalRed} />
      </g>
      {/* Elegant Queen's Hand holding stem */}
      <ellipse cx="48" cy="98" rx="5" ry="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />
      <rect x="42" y="100" width="10" height="12" fill={whiteTone} stroke={inkDark} strokeWidth="1" />

      {/* Royal Scepter / Fan on Right Hand */}
      <line x1="154" y1="62" x2="154" y2="128" stroke={royalGold} strokeWidth="2.5" />
      <polygon points="154,54 150,62 158,62" fill={royalGold} stroke={inkDark} strokeWidth="1" />
      <circle cx="154" cy="54" r="2.5" fill={royalRed} />
      <ellipse cx="153" cy="100" rx="5" ry="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />

      {/* Royal Veil (Draping behind head onto shoulders) */}
      <path
        d="M 68 28 C 54 44 52 82 56 102 L 72 96 C 68 76 68 46 76 34 Z"
        fill={whiteTone}
        stroke={inkDark}
        strokeWidth="1.2"
      />
      <path
        d="M 132 28 C 146 44 148 82 144 102 L 128 96 C 132 76 132 46 124 34 Z"
        fill={whiteTone}
        stroke={inkDark}
        strokeWidth="1.2"
      />

      {/* Hair locks */}
      <path d="M 74 38 Q 72 58 80 66" stroke="#ca8a04" strokeWidth="3" fill="none" />
      <path d="M 126 38 Q 128 58 120 66" stroke="#ca8a04" strokeWidth="3" fill="none" />

      {/* Queen's Graceful Face */}
      <ellipse cx="100" cy="48" rx="18" ry="20" fill={skinTone} stroke={inkDark} strokeWidth="1.4" />

      {/* Delicate Eyes & Lips */}
      <path d="M 88 42 Q 94 39 97 42" stroke={inkDark} strokeWidth="1.3" fill="none" />
      <path d="M 103 42 Q 106 39 112 42" stroke={inkDark} strokeWidth="1.3" fill="none" />
      <circle cx="93" cy="46" r="1.6" fill={inkDark} />
      <circle cx="107" cy="46" r="1.6" fill={inkDark} />
      {/* Gentle Nose */}
      <path d="M 100 44 L 99 53 L 102 53" stroke={inkDark} strokeWidth="1" fill="none" />
      {/* Soft Rosy Lips */}
      <path d="M 96 59 Q 100 58 104 59" stroke={royalRed} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Rosy cheeks */}
      <circle cx="89" cy="52" r="3" fill={royalRed} opacity="0.18" />
      <circle cx="111" cy="52" r="3" fill={royalRed} opacity="0.18" />

      {/* Queen's Golden Tiara / Crown */}
      <rect x="76" y="26" width="48" height="6" rx="1.5" fill={royalGold} stroke={inkDark} strokeWidth="1.3" />
      {/* Jewels on Tiara */}
      <circle cx="84" cy="29" r="1.5" fill={royalRed} />
      <circle cx="100" cy="29" r="1.8" fill={royalNavy} />
      <circle cx="116" cy="29" r="1.5" fill={royalRed} />
      {/* Tiara Arches / Peaks */}
      <polygon points="100,15 95,26 105,26" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="100" cy="14" r="2" fill={royalRed} stroke={inkDark} strokeWidth="0.6" />
      <polygon points="85,18 80,26 89,26" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="85" cy="17" r="1.6" fill={royalRed} stroke={inkDark} strokeWidth="0.6" />
      <polygon points="115,18 111,26 120,26" fill={goldLight} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="115" cy="17" r="1.6" fill={royalRed} stroke={inkDark} strokeWidth="0.6" />
    </g>
  );
}

/* =========================================================================
   JACK (J / Bồi) - Feathered beret, youthful warrior, ruff collar, halberd
   ========================================================================= */
function JackHalf({
  suit,
  royalRed,
  royalNavy,
  royalGold,
  goldLight,
  inkDark,
  skinTone,
  whiteTone,
}: CourtHalfProps) {
  return (
    <g>
      {/* Background drapery */}
      <rect x="12" y="12" width="176" height="120" fill="#f7f0e3" />
      <polygon points="12,12 80,132 12,132" fill={royalNavy} opacity="0.12" />
      <polygon points="188,12 120,132 188,132" fill={royalRed} opacity="0.12" />

      {/* Slashed Knight Doublet / Tunic */}
      <path
        d="M 32 132 C 34 76 56 68 100 68 C 144 68 166 76 168 132 Z"
        fill={royalRed}
        stroke={inkDark}
        strokeWidth="1.5"
      />

      {/* Heraldic Stripes & Patterns on Tunic */}
      <g stroke={inkDark} strokeWidth="1.2">
        <path d="M 68 74 L 60 132" fill={royalNavy} />
        <path d="M 84 72 L 80 132" fill={royalGold} />
        <path d="M 116 72 L 120 132" fill={royalGold} />
        <path d="M 132 74 L 140 132" fill={royalNavy} />
      </g>
      {/* Diagonal sash / crossbelt */}
      <polygon
        points="50,70 62,68 148,132 136,132"
        fill={royalGold}
        stroke={inkDark}
        strokeWidth="1.2"
      />
      {/* Center belt buckle with Suit Crest */}
      <circle cx="100" cy="104" r="10" fill={whiteTone} stroke={inkDark} strokeWidth="1.3" />
      <g transform="translate(93, 97)">
        <SuitIcon suit={suit} size={14} />
      </g>

      {/* Warrior's Halberd / Battle Lance (Right side of Jack) */}
      {/* Halberd Shaft */}
      <line x1="162" y1="14" x2="162" y2="132" stroke="#8d5b2d" strokeWidth="3" />
      {/* Halberd Blade & Spearhead */}
      <polygon
        points="162,10 166,28 158,28"
        fill="#cbd5e1"
        stroke={inkDark}
        strokeWidth="1.2"
      />
      {/* Axe crescent blade */}
      <path
        d="M 162 26 C 174 24 182 32 176 44 C 170 42 166 38 162 40 Z"
        fill="#e2e8f0"
        stroke={inkDark}
        strokeWidth="1.2"
      />
      <circle cx="162" cy="40" r="3" fill={royalGold} stroke={inkDark} strokeWidth="0.8" />
      {/* Hand clasping halberd */}
      <ellipse cx="162" cy="80" rx="5" ry="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />
      <path d="M 154 84 L 168 84 L 172 104 L 152 104 Z" fill={royalNavy} stroke={inkDark} strokeWidth="1.2" />

      {/* Shield / Left Arm Guard */}
      <path
        d="M 28 88 Q 24 112 40 126 L 46 122 Q 34 106 36 86 Z"
        fill={royalNavy}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      <ellipse cx="38" cy="84" rx="4" ry="4" fill={skinTone} stroke={inkDark} strokeWidth="1" />

      {/* Pleated Elizabethan Ruff Collar */}
      <path
        d="M 72 60 C 80 54 120 54 128 60 C 134 68 126 76 100 76 C 74 76 66 68 72 60 Z"
        fill={whiteTone}
        stroke={inkDark}
        strokeWidth="1.4"
      />
      {/* Ruff pleat lines */}
      <g stroke={inkDark} strokeWidth="0.8">
        <line x1="82" y1="62" x2="80" y2="72" />
        <line x1="92" y1="64" x2="92" y2="75" />
        <line x1="100" y1="64" x2="100" y2="76" />
        <line x1="108" y1="64" x2="108" y2="75" />
        <line x1="118" y1="62" x2="120" y2="72" />
      </g>

      {/* Youthful Face */}
      <ellipse cx="100" cy="46" rx="19" ry="20" fill={skinTone} stroke={inkDark} strokeWidth="1.5" />

      {/* Curled Hair */}
      <path
        d="M 78 36 C 72 44 72 60 78 64 C 82 58 84 48 82 40 Z"
        fill="#b45309"
        stroke={inkDark}
        strokeWidth="1.2"
      />
      <path
        d="M 122 36 C 128 44 128 60 122 64 C 118 58 116 48 118 40 Z"
        fill="#b45309"
        stroke={inkDark}
        strokeWidth="1.2"
      />

      {/* Sharp Eyes & Brows */}
      <path d="M 88 41 Q 93 38 97 41" stroke={inkDark} strokeWidth="1.4" fill="none" />
      <path d="M 103 41 Q 107 38 112 41" stroke={inkDark} strokeWidth="1.4" fill="none" />
      <circle cx="93" cy="45" r="1.7" fill={inkDark} />
      <circle cx="107" cy="45" r="1.7" fill={inkDark} />
      {/* Straight Nose */}
      <path d="M 100 42 L 99 51 L 102 51" stroke={inkDark} strokeWidth="1.1" fill="none" />
      {/* Determined Mouth */}
      <path d="M 96 56 Q 100 55 104 56" stroke={inkDark} strokeWidth="1.4" fill="none" />

      {/* Renaissance Tilted Beret & Feather Plume */}
      {/* Beret Crown */}
      <ellipse cx="100" cy="27" rx="30" ry="11" fill={royalNavy} stroke={inkDark} strokeWidth="1.4" />
      {/* Gold beret band */}
      <rect x="76" y="28" width="48" height="6" rx="1.5" fill={royalGold} stroke={inkDark} strokeWidth="1.2" />
      <circle cx="100" cy="31" r="2" fill={royalRed} />
      {/* Magnificent Sweeping Feather Plume */}
      <path
        d="M 78 30 C 62 26 50 14 62 8 C 80 0 102 12 118 20 C 104 22 90 26 78 30 Z"
        fill={goldLight}
        stroke={inkDark}
        strokeWidth="1.2"
      />
      <path d="M 64 12 Q 90 14 112 21" stroke={inkDark} strokeWidth="0.8" fill="none" />
    </g>
  );
}
