import { motion } from 'framer-motion';
import './PhaseBar.css';

const FASES = ['Aceptado', 'Coordinando', 'En curso', 'Finalizado'];
const ESTADO_A_INDICE = { aceptado: 0, coordinando: 1, 'en curso': 2, finalizado: 3 };

// Sol/estrella Y2K que marca cada fase
function Sun({ active }) {
  return (
    <svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={30 + Math.cos(a) * 18}
              y1={30 + Math.sin(a) * 18}
              x2={30 + Math.cos(a) * 27}
              y2={30 + Math.sin(a) * 27}
              stroke={active ? 'var(--yellow)' : '#b9a8e8'}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="30" cy="30" r="15" fill={active ? 'var(--yellow)' : '#b9a8e8'} />
      </g>
    </svg>
  );
}

export default function PhaseBar({ estado }) {
  const actual = ESTADO_A_INDICE[estado] ?? 0;
  const progreso = actual / (FASES.length - 1);

  return (
    <div className="phasebar" role="progressbar" aria-valuenow={actual + 1} aria-valuemin={1} aria-valuemax={4} aria-label={`Fase: ${FASES[actual]}`}>
      <div className="phasebar__track">
        <motion.div
          className="phasebar__fill"
          initial={false}
          animate={{ width: `${progreso * 100}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
        {FASES.map((fase, i) => (
          <div
            key={fase}
            className="phasebar__node"
            style={{ left: `${(i / (FASES.length - 1)) * 100}%` }}
          >
            <motion.div
              animate={i === actual ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={i === actual ? { repeat: Infinity, duration: 1.6 } : {}}
            >
              <Sun active={i <= actual} />
            </motion.div>
            <span className={`phasebar__label ${i === actual ? 'is-current' : ''}`}>{fase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
