import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRelay } from '../context/RelayContext';
import PhaseBar from '../components/PhaseBar';
import Smiley from '../components/Smiley';
import './EnProgreso.css';

const ESTADO_LABEL = {
  aceptado: 'Aceptado',
  coordinando: 'Coordinando',
  'en curso': 'En curso',
  finalizado: 'Finalizado',
  publicado: 'Esperando ayudante',
};

export default function EnProgreso() {
  const {
    favores,
    enProgreso,
    avanzarFavor,
    completarFavor,
    cancelarFavor,
    reprogramarFavor,
    enviarMensaje,
  } = useRelay();

  const misPublicados = favores.filter((f) => f.estado === 'publicado' && f.usuario === 'Tú');
  const [seleccionado, setSeleccionado] = useState(null);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [reprogramando, setReprogramando] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState('');

  const favor = enProgreso.find((f) => f.id === seleccionado) ?? enProgreso[0];

  // Estado vacío: enlaza al Marketplace
  if (enProgreso.length === 0) {
    return (
      <main className="page prog prog--empty">
        <Smiley size={170} withHand={false} />
        <h1>Nada en progreso… aún</h1>
        <p>Toma un favor del Marketplace o pide uno y aquí verás cómo avanza.</p>
        <div className="prog__empty-actions">
          <Link to="/marketplace" className="pill pill--solid pill--big">
            Ir al Marketplace
          </Link>
          <Link to="/pedir" className="pill pill--yellow pill--big">
            Pedir un favor
          </Link>
        </div>

        {misPublicados.length > 0 && (
          <div className="prog__waiting">
            <h2>Tus favores publicados</h2>
            {misPublicados.map((f) => (
              <div key={f.id} className="prog__waiting-item">
                <span className="prog__dot" style={{ background: f.color }} />
                <strong>{f.titulo}</strong>
                <span className="prog__waiting-state">{ESTADO_LABEL[f.estado]}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  const enviar = () => {
    if (!mensaje.trim()) return;
    enviarMensaje(favor.id, mensaje.trim());
    setMensaje('');
  };

  return (
    <main className="page prog">
      <div className="prog__layout">
        {/* -------- Columna izquierda -------- */}
        <section className="prog__left">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Favor en progreso
          </motion.h1>

          {enProgreso.length > 1 && (
            <div className="prog__tabs">
              {enProgreso.map((f) => (
                <button
                  key={f.id}
                  className={`pill ${favor.id === f.id ? 'active' : ''}`}
                  onClick={() => setSeleccionado(f.id)}
                >
                  {f.titulo}
                </button>
              ))}
            </div>
          )}

          <div className="prog__info">
            <p>
              <span className="section-label">Favor:</span> {favor.titulo}
            </p>
            <p>
              <span className="section-label">Estado:</span> {ESTADO_LABEL[favor.estado]}
            </p>
          </div>

          <PhaseBar estado={favor.estado} />

          <div className="card-outline prog__detail">
            <p>
              <span className="section-label">Fecha y hora:</span> {favor.fecha}
            </p>
            <p>
              <span className="section-label">Lugar:</span> {favor.lugar}
            </p>
            <p className="prog__person">
              <span className="section-label">Persona que ayuda:</span>
              <span className="prog__avatar" style={{ background: favor.color }} />
              {favor.ayudante ?? favor.usuario}
            </p>
            <p>
              <span className="section-label">Chat:</span>{' '}
              <button className="pill pill--solid" onClick={() => setChatAbierto(true)}>
                Mensaje
              </button>
            </p>
          </div>

          {reprogramando && (
            <motion.div
              className="prog__reprogramar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <input
                className="input-pill"
                placeholder="Ej: Martes, 6:00PM"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
              />
              <button
                className="pill pill--solid"
                onClick={() => {
                  if (nuevaFecha.trim()) {
                    reprogramarFavor(favor.id, nuevaFecha.trim());
                    setReprogramando(false);
                    setNuevaFecha('');
                  }
                }}
              >
                Guardar
              </button>
            </motion.div>
          )}
        </section>

        {/* -------- Columna derecha -------- */}
        <section className="prog__right">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <Smiley size={300} />
          </motion.div>

          <div className="prog__actions">
            <button className="pill pill--solid" onClick={() => setReprogramando(!reprogramando)}>
              Reprogramar favor
            </button>
            <button
              className="pill pill--solid"
              onClick={() => {
                cancelarFavor(favor.id);
                setSeleccionado(null);
              }}
            >
              Cancelar favor
            </button>
            {favor.estado !== 'en curso' ? (
              <button className="pill pill--yellow" onClick={() => avanzarFavor(favor.id)}>
                Avanzar fase →
              </button>
            ) : (
              <button
                className="pill pill--yellow"
                onClick={() => {
                  completarFavor(favor.id);
                  setSeleccionado(null);
                }}
              >
                Completado ✦
              </button>
            )}
          </div>
        </section>
      </div>

      {/* -------- Chat privado -------- */}
      <AnimatePresence>
        {chatAbierto && (
          <motion.div
            className="prog__chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatAbierto(false)}
          >
            <motion.div
              className="prog__chat"
              initial={{ y: 80, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={`Chat del favor ${favor.titulo}`}
            >
              <header className="prog__chat-head">
                <span className="prog__avatar" style={{ background: favor.color }} />
                <strong>{favor.ayudante === 'Tú' ? favor.usuario : favor.ayudante ?? favor.usuario}</strong>
                <button className="prog__chat-close" onClick={() => setChatAbierto(false)} aria-label="Cerrar chat">
                  ✕
                </button>
              </header>

              <div className="prog__chat-body">
                {(favor.mensajes ?? []).length === 0 && (
                  <p className="prog__chat-empty">
                    Coordina aquí la fecha, la hora y el lugar. Nada de datos de contacto públicos ✦
                  </p>
                )}
                {(favor.mensajes ?? []).map((m, i) => (
                  <div key={i} className={`prog__msg ${m.de === 'Tú' ? 'prog__msg--mio' : ''}`}>
                    <p>{m.texto}</p>
                    <span>{m.hora}</span>
                  </div>
                ))}
              </div>

              <footer className="prog__chat-foot">
                <input
                  className="input-pill"
                  placeholder="Escribe un mensaje…"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviar()}
                />
                <button className="pill pill--solid" onClick={enviar}>
                  →
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
