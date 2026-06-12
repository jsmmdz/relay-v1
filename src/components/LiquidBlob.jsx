// Forma orgánica tipo gel que fluye de fondo. variant: 'top' | 'bottom' | 'side'
export default function LiquidBlob({ color = 'var(--lilac)', variant = 'top', style }) {
  const paths = {
    top: 'M0,0 L1440,0 L1440,260 C1300,360 1180,300 1040,330 C880,365 800,460 640,420 C480,380 420,290 260,320 C140,342 60,300 0,340 Z',
    bottom:
      'M0,500 L0,210 C120,140 260,230 400,190 C560,145 620,60 780,95 C940,130 1000,240 1160,210 C1300,184 1380,120 1440,170 L1440,500 Z',
    side: 'M0,0 C220,40 300,180 260,340 C230,470 320,560 250,680 C200,765 80,790 0,760 Z',
  };

  return (
    <svg
      viewBox={variant === 'side' ? '0 0 360 800' : '0 0 1440 500'}
      preserveAspectRatio="none"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gel-${variant}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g style={{ animation: 'blob-drift 14s ease-in-out infinite', transformOrigin: 'center' }}>
        <path d={paths[variant]} fill={color} />
        <path d={paths[variant]} fill={`url(#gel-${variant})`} />
      </g>
    </svg>
  );
}
