import { SVGProps } from 'react';

/**
 * Custom SVG icon set for the Settling-In Checklist.
 * Hand-drawn feel: organic curves, slightly off-axis, no AI default look.
 * All icons inherit color via currentColor and size via h-/w- classes.
 */

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const base = (props: IconProps) => ({
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

/** A seedling pushing through a soil mound. */
export const SproutMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 19c2 1 4 1.5 9 1.5S16 20 21 19" />
    <path d="M12 19v-7" />
    <path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z" />
    <path d="M12 14c3 0 5.5-1.5 6-4.5-3-.5-5.5 1-6 4.5z" />
  </svg>
);

/** An asymmetric leaf with a single curving vein. */
export const LeafMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 19c0-8 5-13 14-13-.5 9-5.5 14-13 14a3 3 0 0 1-1-1z" />
    <path d="M5 19c4-3 7-6 9-10" />
    <path d="M11 12.5l3 .5" />
  </svg>
);

/** Five soft petals around a small off-center heart. */
export const BloomMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 6c1.8-2.5 5-1.5 5 1.2 0 1.6-1.3 2.6-3 3" />
    <path d="M17.5 10c2.6.6 3 3.8.6 5-1.4.7-2.9.2-3.8-1" />
    <path d="M15 16c.7 2.6-2 4.5-4 3-1.3-1-1.4-2.6-.7-4" />
    <path d="M9 16.5c-2.5.4-4.2-2.2-2.8-4.3.8-1.2 2.3-1.5 3.6-.9" />
    <path d="M7 11c-1.8-1.8-.4-4.8 2.1-4.7 1.5 0 2.6 1.1 2.9 2.7" />
    <circle cx="12" cy="12.5" r="1.6" />
  </svg>
);

/** Calendar with a soft sketched plus, ring binding at top. */
export const CalendarPlusMark = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M8 3.5v3M16 3.5v3" />
    <path d="M3.5 10h17" />
    <path d="M12 12.5v5M9.5 15h5" />
  </svg>
);

/** Calendar with a confident check, marking a date as set. */
export const CalendarCheckMark = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M8 3.5v3M16 3.5v3" />
    <path d="M3.5 10h17" />
    <path d="M8.5 15.2l2.3 2.3 4.7-4.7" />
  </svg>
);

/** Trophy as a chalice with a small star in the bowl. */
export const TrophyMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M7 4.5h10v4a5 5 0 0 1-10 0v-4z" />
    <path d="M7 6.5H4.5a2 2 0 0 0 2.5 3.5" />
    <path d="M17 6.5h2.5a2 2 0 0 1-2.5 3.5" />
    <path d="M12 13.5V17" />
    <path d="M8.5 20h7" />
    <path d="M9.5 17h5l-.5 3h-4l-.5-3z" />
    <path d="M12 6.2l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.8-1.4.8.3-1.5-1.1-1 1.5-.2.7-1.4z" />
  </svg>
);

/** Two hands meeting around a small heart, for "share with coach". */
export const HandshakeHeartMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 12l4-4 4 3 2-1 3 2-3 3-2-1-3 3-5-5z" />
    <path d="M21 12l-4-4-4 3" />
    <path d="M14 15l3 3 4-4" />
    <path d="M12 9.2c.7-1.3 2.6-1.1 2.6.4 0 1.3-2.6 2.6-2.6 2.6s-2.6-1.3-2.6-2.6c0-1.5 1.9-1.7 2.6-.4z" />
  </svg>
);

/** Two organic arrows crossing, for "reshuffle priorities". */
export const ShuffleMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 7h3c2 0 3 1 4.5 3l3 4c1.5 2 2.5 3 4.5 3h2" />
    <path d="M3 17h3c2 0 3-1 4.5-3" />
    <path d="M13.5 10c1.5-2 2.5-3 4.5-3h2" />
    <path d="M18 4l3 3-3 3" />
    <path d="M18 14l3 3-3 3" />
  </svg>
);

/** A confident, slightly tilted check mark. */
export const CheckMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4.5 12.5l4.5 4.5L20 6.5" />
  </svg>
);
