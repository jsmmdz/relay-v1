// Lettering custom del logo RELAY: letras burbuja Y2K infladas tipo gel,
// trazadas como tubos redondeados con degradado (luz arriba, sombra abajo),
// borde fino verde menta, brillos blancos y contadores morados (R y A),
// fiel a la referencia visual del cartel.

const TUBE = 42;
const EDGE = '#58c690';
const COUNTER = '#5b4ea6';

const LETRAS = {
  R: {
    viewBox: '0 0 130 170',
    tilt: -2,
    dy: 0,
    bones: [
      'M44 46 C42 75 42 105 44 138',
      'M46 50 C100 22 118 92 50 94',
      'M56 96 C76 108 90 122 98 144',
    ],
    counter: { cx: 70, cy: 66, rx: 10, ry: 14, rot: -12 },
    shines: [
      { d: 'M62 38 C74 33 86 38 93 47', w: 9 },
      { d: 'M35 70 L35 102', w: 7 },
    ],
    dots: [],
  },
  E: {
    viewBox: '0 0 120 170',
    tilt: 3,
    dy: -2,
    bones: [
      'M52 48 C48 80 48 112 52 140',
      'M52 50 C68 42 84 42 96 46',
      'M50 94 C64 90 74 90 84 92',
      'M52 138 C68 146 84 146 98 142',
    ],
    counter: null,
    shines: [
      { d: 'M60 40 C72 36 82 36 90 40', w: 8 },
      { d: 'M43 72 L43 104', w: 7 },
    ],
    dots: [{ cx: 95, cy: 44, r: 3.5 }],
  },
  L: {
    viewBox: '0 0 115 170',
    tilt: -3,
    dy: 1,
    bones: [
      'M50 46 C46 78 46 108 50 138',
      'M48 132 C62 144 78 144 92 138',
    ],
    counter: null,
    shines: [
      { d: 'M42 66 L42 110', w: 7 },
      { d: 'M66 130 L84 128', w: 7 },
    ],
    dots: [{ cx: 52, cy: 48, r: 4 }],
  },
  A: {
    viewBox: '0 0 135 170',
    tilt: 5,
    dy: -2,
    bones: [
      'M68 46 C56 78 48 110 42 142',
      'M68 46 C80 78 88 110 96 142',
      'M52 108 C64 102 78 102 88 106',
    ],
    counter: { cx: 68, cy: 84, rx: 9, ry: 13, rot: 6 },
    shines: [
      { d: 'M62 56 C56 72 50 92 46 110', w: 8 },
    ],
    dots: [{ cx: 72, cy: 50, r: 4 }],
  },
  Y: {
    viewBox: '0 0 135 170',
    tilt: 7,
    dy: 4,
    bones: [
      'M44 48 C52 66 58 80 66 96',
      'M100 44 C92 64 82 82 70 98',
      'M68 94 C64 114 58 128 48 142',
    ],
    counter: null,
    shines: [
      { d: 'M94 50 C88 62 82 72 76 82', w: 8 },
      { d: 'M58 114 C55 124 51 132 46 140', w: 7 },
    ],
    dots: [{ cx: 104, cy: 40, r: 4 }],
  },
};

export default function BubbleLetter({ char }) {
  const L = LETRAS[char];
  if (!L) return null;
  const gid = `gel-${char}`;

  return (
    <svg
      viewBox={L.viewBox}
      className="bubble-letter"
      style={{ transform: `rotate(${L.tilt}deg) translateY(${L.dy}%)` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="165">
          <stop offset="0%" stopColor="#ffe566" />
          <stop offset="45%" stopColor="#ffd200" />
          <stop offset="100%" stopColor="#efa600" />
        </linearGradient>
      </defs>

      {/* borde menta (debajo de todo el tubo amarillo) */}
      {L.bones.map((d, i) => (
        <path
          key={`e${i}`}
          d={d}
          fill="none"
          stroke={EDGE}
          strokeWidth={TUBE + 7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* tubo de gel amarillo */}
      {L.bones.map((d, i) => (
        <path
          key={`g${i}`}
          d={d}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={TUBE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* contador morado (hueco de la R y la A) */}
      {L.counter && (
        <ellipse
          cx={L.counter.cx}
          cy={L.counter.cy}
          rx={L.counter.rx}
          ry={L.counter.ry}
          fill={COUNTER}
          transform={`rotate(${L.counter.rot} ${L.counter.cx} ${L.counter.cy})`}
        />
      )}

      {/* brillos */}
      {L.shines.map((s, i) => (
        <path
          key={`s${i}`}
          d={s.d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={s.w}
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
      {L.dots.map((d, i) => (
        <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fill="#ffffff" opacity="0.9" />
      ))}
    </svg>
  );
}
