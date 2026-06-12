import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './FavorBubble.css';

// El tamaño de la carita refleja la dificultad del favor:
// Baja = pequeña, Media = mediana, Alta = grande.
const SIZE_POR_DIFICULTAD = { Baja: 150, Media: 195, Alta: 248 };

// Carita feliz flotante = un favor disponible.
// Hover: crece y despliega tarjeta con la info (empuja a las demás por layout).
// Click: abre la misión. `scatter` desplaza la burbuja en vertical para la
// disposición dispersa del muro (se atenúa en móvil vía --scatter).
export default function FavorBubble({ favor, index = 0, scatter = 0 }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const s = SIZE_POR_DIFICULTAD[favor.dificultad] ?? favor.size ?? 180;

  return (
    <motion.div
      layout
      className="bubble-slot"
      style={{ '--bubble-color': favor.color, '--sy': `${scatter}px` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: index * 0.05 }}
    >
      <motion.button
        layout
        className="bubble"
        style={{
          width: s,
          height: s,
          background: favor.color,
          animationDelay: `${(index % 5) * 0.7}s`,
        }}
        animate={{ scale: hover ? 1.12 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        onClick={() => navigate(`/favor/${favor.id}`)}
        aria-label={`Ver favor: ${favor.titulo}`}
      >
        {/* brillo gel */}
        <span className="bubble__shine" aria-hidden="true" />
        {/* carita */}
        <svg className="bubble__face" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="38" cy="40" rx="5" ry="8" fill="#121212" />
          <ellipse cx="62" cy="40" rx="5" ry="8" fill="#121212" />
          <path d="M32 58 Q50 74 68 58" stroke="#121212" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </svg>
        <span className="bubble__title">{favor.titulo}</span>
      </motion.button>

      <AnimatePresence>
        {hover && (
          <motion.div
            className="bubble-card"
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="bubble-card__row">
              <span className="bubble-card__avatar" style={{ background: favor.color }} />
              <strong>{favor.usuario}</strong>
              <span className="bubble-card__chip">{favor.dificultad}</span>
            </div>
            <div className="bubble-card__row bubble-card__row--meta">
              <span>⏱ {favor.duracion} min</span>
              <span>{favor.categoria}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
