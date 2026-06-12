import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRelay } from '../context/RelayContext';
import FavorBubble from '../components/FavorBubble';
import Smiley from '../components/Smiley';
import LiquidBlob from '../components/LiquidBlob';
import './Marketplace.css';

const FILTROS = {
  distancia: {
    label: 'Distancia',
    opciones: ['Todas', 'Menos de 100m', 'Menos de 200m'],
  },
  dificultad: {
    label: 'Dificultad',
    opciones: ['Todas', 'Baja', 'Media', 'Alta'],
  },
  duracion: {
    label: 'Duración',
    opciones: ['Todas', '15 min', '30 min', '1 hora'],
  },
};

const PROPIEDADES = ['Presencial', 'Virtual', 'Nudos', 'Otro favor'];

// Desplazamientos verticales (px) que reparten las caritas en 3 "filas"
// virtuales (banda alta ≈ -140, banda media ≈ 0, banda baja ≈ +140) con
// algo de variación para que el muro se sienta orgánico; cicla por índice.
const SCATTER = [-140, 10, 135, -120, -15, 150, -150, 30, 120, -130, 0, 140];

export default function Marketplace() {
  const { disponibles } = useRelay();
  const [busqueda, setBusqueda] = useState('');
  const [filtroAbierto, setFiltroAbierto] = useState(null);
  const [filtros, setFiltros] = useState({ distancia: 'Todas', dificultad: 'Todas', duracion: 'Todas' });
  const [propsAbiertas, setPropsAbiertas] = useState(false);
  const [propiedades, setPropiedades] = useState([]);

  const hayFiltrosActivos =
    busqueda !== '' ||
    propiedades.length > 0 ||
    Object.values(filtros).some((v) => v !== 'Todas');

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltros({ distancia: 'Todas', dificultad: 'Todas', duracion: 'Todas' });
    setPropiedades([]);
  };

  // Scroll pinning: el muro se fija al llegar arriba y el scroll vertical
  // se mapea a desplazamiento horizontal de la pista.
  const pinRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const [recorrido, setRecorrido] = useState(0); // px horizontales por recorrer

  const resultados = useMemo(() => {
    return disponibles.filter((f) => {
      const q = busqueda.trim().toLowerCase();
      if (q && !`${f.titulo} ${f.descripcion} ${f.categoria}`.toLowerCase().includes(q)) return false;
      if (filtros.dificultad !== 'Todas' && f.dificultad !== filtros.dificultad) return false;
      if (filtros.duracion === '15 min' && f.duracion > 15) return false;
      if (filtros.duracion === '30 min' && f.duracion > 30) return false;
      if (filtros.duracion === '1 hora' && f.duracion > 60) return false;
      if (filtros.distancia === 'Menos de 100m' && f.distancia >= 100) return false;
      if (filtros.distancia === 'Menos de 200m' && f.distancia >= 200) return false;
      if (propiedades.includes('Presencial') && f.tipo !== 'Presencial') return false;
      if (propiedades.includes('Virtual') && f.tipo !== 'Virtual') return false;
      if (propiedades.includes('Nudos') && f.recompensa !== 'Nudos') return false;
      if (propiedades.includes('Otro favor') && f.recompensa !== 'Otro favor') return false;
      return true;
    });
  }, [disponibles, busqueda, filtros, propiedades]);

  const toggleProp = (p) =>
    setPropiedades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  // Mide cuántos píxeles horizontales debe recorrer la pista; ese valor
  // extiende la "pista de aterrizaje" vertical del contenedor de pinning.
  useEffect(() => {
    const medir = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      setRecorrido(Math.max(0, track.scrollWidth - sticky.clientWidth));
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [resultados]);

  // Scroll pinning: el scroll vertical NATIVO de la página nunca se
  // intercepta. Mientras el contenedor extendido cruza el viewport
  // (sección fijada por position: sticky), el progreso vertical se mapea
  // a translateX de la pista; al agotarse el recorrido, la sección se
  // suelta y la página continúa con normalidad.
  useEffect(() => {
    const onScroll = () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track || recorrido <= 0) return;
      const rect = pin.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progreso = Math.min(1, Math.max(0, -rect.top / runway));
      track.style.transform = `translateX(${-progreso * recorrido}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [recorrido]);

  return (
    <main className="page mkt">
      {/* Cabecera lila sólida: su altura crece con el contenido (p. ej. al
          desplegar "Propiedades") y empuja la curva divisoria hacia abajo */}
      <div className="mkt__head">
        <div className="mkt__head-content">
          <div className="mkt__head-left">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mkt__title"
            >
              Favores
            </motion.h1>

            <div className="mkt__filters">
              {Object.entries(FILTROS).map(([key, def]) => (
                <button
                  key={key}
                  className={`pill ${filtros[key] !== 'Todas' || filtroAbierto === key ? 'active' : ''}`}
                  onClick={() => setFiltroAbierto(filtroAbierto === key ? null : key)}
                >
                  {filtros[key] === 'Todas' ? def.label : filtros[key]}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {filtroAbierto && (
                <motion.div
                  className="mkt__filter-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {FILTROS[filtroAbierto].opciones.map((op) => (
                    <button
                      key={op}
                      className={`pill mkt__option ${filtros[filtroAbierto] === op ? 'active' : ''}`}
                      onClick={() => {
                        setFiltros((prev) => ({ ...prev, [filtroAbierto]: op }));
                        setFiltroAbierto(null);
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <input
              className="input-pill mkt__search"
              placeholder="“Barra de búsqueda”"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar favores"
            />

            <button
              className="input-pill mkt__props-toggle"
              onClick={() => setPropsAbiertas(!propsAbiertas)}
              aria-expanded={propsAbiertas}
            >
              “Propiedades” {propsAbiertas ? '⌃' : '⌄'}
            </button>

            <AnimatePresence>
              {propsAbiertas && (
                <motion.div
                  className="mkt__props"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {PROPIEDADES.map((p) => (
                    <button
                      key={p}
                      className={`pill mkt__option ${propiedades.includes(p) ? 'active' : ''}`}
                      onClick={() => toggleProp(p)}
                    >
                      {p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="mkt__mascot"
            initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
          >
            <Smiley size={250} />
          </motion.div>
        </div>
      </div>

      {/* Curva divisoria lila → amarillo (en flujo: el morado la empuja) */}
      <div className="mkt__wave" aria-hidden="true">
        <LiquidBlob color="var(--lilac)" variant="top" />
      </div>

      {/* Zona amarilla con caritas */}
      <section className="mkt__board" aria-label="Favores disponibles">
        {disponibles.length === 0 ? (
          <div className="mkt__empty">
            <Smiley size={150} withHand={false} />
            <h2>Aún no hay favores por aquí</h2>
            <p>Sé quien rompa el hielo en tu comunidad.</p>
            <Link to="/pedir" className="pill pill--solid pill--big">
              Pedir el primer favor
            </Link>
          </div>
        ) : resultados.length === 0 ? (
          <div className="mkt__empty">
            <Smiley size={150} withHand={false} />
            <h2>No hay favores que encajen con estos filtros</h2>
            <button className="pill pill--solid" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          /* Contenedor extendido (100vh + recorrido horizontal): mientras se
             cruza, la vista interior queda fijada con position: sticky */
          <div
            className="mkt__pin"
            ref={pinRef}
            style={{ height: recorrido > 0 ? `calc(100vh + ${recorrido}px)` : 'auto' }}
          >
            <div className="mkt__sticky" ref={stickyRef}>
              <div className="mkt__track" ref={trackRef}>
                {resultados.map((f, i) => (
                  <FavorBubble key={f.id} favor={f} index={i} scatter={SCATTER[i % SCATTER.length]} />
                ))}
              </div>
              <div className="mkt__hint">
                <span>← Desliza para ver más · pasa el mouse para detalles · click para abrir la misión</span>
                {hayFiltrosActivos && (
                  <button className="pill" onClick={limpiarFiltros}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
