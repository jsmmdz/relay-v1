import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRelay } from '../context/RelayContext';
import Smiley from '../components/Smiley';
import LiquidBlob from '../components/LiquidBlob';
import './FavorDetail.css';

export default function FavorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favores, aceptarFavor } = useRelay();
  const favor = favores.find((f) => f.id === id);
  const [pasosHechos, setPasosHechos] = useState([]);

  if (!favor) {
    return (
      <main className="page mision mision--missing">
        <Smiley size={140} withHand={false} />
        <h1>Este favor ya no está</h1>
        <Link to="/marketplace" className="pill pill--solid pill--big">
          Volver al Marketplace
        </Link>
      </main>
    );
  }

  const esMio = favor.usuario === 'Tú';
  const yaTomado = favor.estado !== 'publicado';

  const togglePaso = (i) =>
    setPasosHechos((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const aceptar = () => {
    aceptarFavor(favor.id);
    navigate('/progreso');
  };

  return (
    <main className="page mision">
      <div className="mision__head-blob" aria-hidden="true">
        <LiquidBlob color="var(--lilac)" variant="top" />
      </div>

      <div className="mision__content">
        {/* Columna izquierda: la carita con su color heredado */}
        <div className="mision__left">
          <motion.h1
            className="mision__title"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {favor.titulo}
          </motion.h1>

          <motion.div
            className="mision__bubble"
            style={{ background: favor.color }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 13 }}
          >
            <span className="mision__shine" aria-hidden="true" />
            <svg viewBox="0 0 100 100" className="mision__face" aria-hidden="true">
              <ellipse cx="38" cy="40" rx="5" ry="8" fill="#121212" />
              <ellipse cx="62" cy="40" rx="5" ry="8" fill="#121212" />
              <path d="M32 58 Q50 74 68 58" stroke="#121212" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            </svg>
            <p className="mision__desc">{favor.descripcion}</p>
          </motion.div>

          <div className="mision__meta">
            <span className="pill">{favor.usuario}</span>
            <span className="pill">{favor.dificultad}</span>
            <span className="pill">⏱ {favor.duracion} min</span>
            <span className="pill">{favor.tipo}</span>
            <span className="pill">🎁 {favor.recompensa}</span>
          </div>
        </div>

        {/* Columna derecha: pasos a completar */}
        <div className="mision__right">
          <motion.h2
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Pasos a completar
          </motion.h2>

          <ol className="mision__steps">
            {favor.pasos.map((paso, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <button
                  className={`mision__step ${pasosHechos.includes(i) ? 'is-done' : ''}`}
                  onClick={() => togglePaso(i)}
                  aria-pressed={pasosHechos.includes(i)}
                >
                  <span className="mision__step-num">#{i + 1}</span>
                  <span className="mision__step-text">{paso}</span>
                  <span className="mision__step-check" style={{ background: pasosHechos.includes(i) ? favor.color : 'transparent' }} />
                </button>
              </motion.li>
            ))}
          </ol>

          <div className="mision__actions">
            <Link to="/marketplace" className="pill">
              ← Volver
            </Link>
            {esMio ? (
              <span className="mision__note">Este favor lo pediste tú ✦</span>
            ) : yaTomado ? (
              <Link to="/progreso" className="pill pill--yellow pill--big">
                Ya está en progreso →
              </Link>
            ) : (
              <button className="pill pill--yellow pill--big" onClick={aceptar}>
                Aceptar misión ✦
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
