import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRelay } from '../context/RelayContext';
import { CATEGORIAS, COLORS } from '../data/seed';
import './PedirFavor.css';

const DIAS = ['Hoy', 'Mañana', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HORAS = ['8:00AM', '10:00AM', '12:00M', '2:00PM', '4:00PM', '6:00PM', '8:00PM'];

// "Generar con IA" (simulado): solo ordena y redacta lo que la persona aportó,
// nunca inventa datos que el usuario no dio.
function redactarConIA(idea, categoria, tipo, duracion) {
  const limpia = idea.trim().replace(/\.+$/, '');
  const modo = tipo === 'Virtual' ? 'de forma virtual' : 'en persona';
  const cat = categoria ? ` Es algo de ${categoria.toLowerCase()}` : '';
  return `Necesito una mano con esto: ${limpia}.${cat} y calculo que toma unos ${duracion} minutos ${modo}. ¡Cualquier ayuda crea un lazo! ✦`;
}

export default function PedirFavor() {
  const navigate = useNavigate();
  const { publicarFavor } = useRelay();

  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modo, setModo] = useState('Automática');
  const [tipo, setTipo] = useState('Presencial');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [duracion, setDuracion] = useState(15);
  const [otraDuracion, setOtraDuracion] = useState(false);
  const [recompensa, setRecompensa] = useState('Nudos');
  const [dirigido, setDirigido] = useState('Privado');
  const [notificar, setNotificar] = useState(true);
  const [alMuro, setAlMuro] = useState(true);
  const [errores, setErrores] = useState({});
  const [avisoIA, setAvisoIA] = useState('');
  const [generando, setGenerando] = useState(false);
  const [publicado, setPublicado] = useState(false);

  const valido = categoria !== '' && descripcion.trim().length >= 10;

  const generarIA = () => {
    // Guardrail: la IA pide una pista mínima en lugar de inventar
    if (descripcion.trim().length < 5) {
      setAvisoIA('Escribe primero una idea suelta (mínimo unas palabras) y la IA la redacta por ti.');
      return;
    }
    setAvisoIA('');
    setGenerando(true);
    // Simula la latencia del servicio; si fallara, el campo sigue editable a mano
    setTimeout(() => {
      setDescripcion(redactarConIA(descripcion, categoria, tipo, duracion));
      setGenerando(false);
    }, 900);
  };

  const confirmar = () => {
    const errs = {};
    if (!categoria) errs.categoria = 'Selecciona una categoría';
    if (descripcion.trim().length < 10) errs.descripcion = 'Describe tu favor (mínimo 10 caracteres)';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    // Si la descripción viene de la plantilla de IA, el título sale de la idea original
    const nucleo = descripcion
      .replace(/^Necesito una mano con esto:\s*/i, '')
      .split(/[.!\n]/)[0]
      .trim();
    const titulo =
      nucleo.split(/\s+/).slice(0, 4).join(' ').replace(/[.,;:!]$/, '') || 'Nuevo favor';

    publicarFavor({
      titulo: titulo.charAt(0).toUpperCase() + titulo.slice(1),
      descripcion: descripcion.trim(),
      categoria,
      dificultad: duracion >= 60 ? 'Alta' : duracion >= 30 ? 'Media' : 'Baja',
      duracion,
      distancia: 50,
      tipo,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 170 + Math.floor(Math.random() * 60),
      recompensa,
      dirigido,
      lugar: tipo === 'Virtual' ? 'Virtual' : 'Conjunto Mirador 3',
      fecha: dia && hora ? `${dia}, ${hora}` : 'Por coordinar',
      pasos: [
        'Esperar a que alguien acepte el favor',
        'Coordinar los detalles por el chat',
        'Acordar día, hora y lugar',
        'Realizar el favor',
        'Marcarlo como completado',
      ],
    });

    setPublicado(true);
    setTimeout(() => navigate('/marketplace'), 1600);
  };

  return (
    <main className="page pedir">
      <motion.h1
        className="pedir__title"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        Pide tu favor
      </motion.h1>

      <div className="pedir__grid">
        {/* -------- Columna 1: categoría + descripción -------- */}
        <section className="pedir__col">
          <h2 className="pedir__subtitle">
            Selecciona una categoría
            {errores.categoria && <span className="pedir__error"> · {errores.categoria}</span>}
          </h2>
          <div className={`pedir__chips ${errores.categoria ? 'shake' : ''}`}>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                className={`pill ${categoria === c ? 'active' : ''}`}
                onClick={() => {
                  setCategoria(c);
                  setErrores((e) => ({ ...e, categoria: undefined }));
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <h2 className="pedir__subtitle">
            Describe tu favor
            {errores.descripcion && <span className="pedir__error"> · {errores.descripcion}</span>}
          </h2>
          <textarea
            className={`input-pill pedir__textarea ${errores.descripcion ? 'error shake' : ''}`}
            placeholder="“Necesito ayuda para cargar bolsas del supermercado”"
            rows={3}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setErrores((er) => ({ ...er, descripcion: undefined }));
              setAvisoIA('');
            }}
          />
          <button className="pill pill--solid" onClick={generarIA} disabled={generando}>
            {generando ? 'Redactando…' : '✦ Generar con IA'}
          </button>
          <AnimatePresence>
            {avisoIA && (
              <motion.p
                className="pedir__aviso"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {avisoIA}
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        {/* -------- Columna 2: dónde y cómo + recompensa -------- */}
        <section className="pedir__col">
          <h2 className="pedir__subtitle">¿Dónde y cómo se hará?</h2>

          <div className="pedir__chips">
            {['Automática', 'Manual'].map((m) => (
              <button key={m} className={`pill ${modo === m ? 'active' : ''}`} onClick={() => setModo(m)}>
                {m}
              </button>
            ))}
          </div>

          <div className="pedir__row">
            <span className="section-label">Tipo:</span>
            <div className="pedir__chips">
              {['Presencial', 'Virtual'].map((t) => (
                <button key={t} className={`pill ${tipo === t ? 'active' : ''}`} onClick={() => setTipo(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pedir__row">
            <span className="section-label">Día y hora:</span>
            <div className="pedir__selects">
              <select className="input-pill" value={dia} onChange={(e) => setDia(e.target.value)} aria-label="Día">
                <option value="">Día ▾</option>
                {DIAS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select className="input-pill" value={hora} onChange={(e) => setHora(e.target.value)} aria-label="Hora">
                <option value="">Hora ▾</option>
                {HORAS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pedir__row">
            <span className="section-label">Duración estimada:</span>
            <div className="pedir__chips">
              {[
                { v: 15, t: '15 min' },
                { v: 30, t: '30 min' },
                { v: 60, t: '1 hora' },
              ].map(({ v, t }) => (
                <button
                  key={v}
                  className={`pill ${!otraDuracion && duracion === v ? 'active' : ''}`}
                  onClick={() => {
                    setDuracion(v);
                    setOtraDuracion(false);
                  }}
                >
                  {t}
                </button>
              ))}
              <button className={`pill ${otraDuracion ? 'active' : ''}`} onClick={() => setOtraDuracion(true)}>
                Otro
              </button>
            </div>
            {otraDuracion && (
              <input
                className="input-pill"
                type="number"
                min="5"
                max="480"
                placeholder="Minutos"
                onChange={(e) => setDuracion(Number(e.target.value) || 15)}
              />
            )}
          </div>

          <h2 className="pedir__subtitle">¿Qué ofreces a cambio?</h2>
          <div className="pedir__chips">
            {['Nudos', 'Otro favor', 'Otro…'].map((r) => (
              <button key={r} className={`pill ${recompensa === r ? 'active' : ''}`} onClick={() => setRecompensa(r)}>
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* -------- Columna 3: dirigido + confirmación -------- */}
        <section className="pedir__col">
          <h2 className="pedir__subtitle">¿A quién va dirigido?</h2>
          <div className="pedir__chips">
            {['Privado', 'Mis comunidades'].map((d) => (
              <button key={d} className={`pill ${dirigido === d ? 'active' : ''}`} onClick={() => setDirigido(d)}>
                {d} {d === 'Mis comunidades' ? '▾' : ''}
              </button>
            ))}
          </div>

          <label className="pedir__check">
            <input type="checkbox" checked={notificar} onChange={(e) => setNotificar(e.target.checked)} />
            <span className="pedir__checkbox" aria-hidden="true" />
            Notificar a usuarios cercanos
          </label>
          <label className="pedir__check">
            <input type="checkbox" checked={alMuro} onChange={(e) => setAlMuro(e.target.checked)} />
            <span className="pedir__checkbox" aria-hidden="true" />
            Agregar al muro de Marketplace
          </label>

          <motion.button
            className="pill pill--yellow pill--big pedir__confirm"
            onClick={confirmar}
            disabled={!valido || publicado}
            whileTap={{ scale: 0.96 }}
          >
            {publicado ? '¡Publicado! ✦' : 'Confirmar publicación'}
          </motion.button>

          {!valido && (
            <p className="pedir__hint">Elige una categoría y describe tu favor para publicar.</p>
          )}

          <AnimatePresence>
            {publicado && (
              <motion.div
                className="pedir__success"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                Tu favor ya flota como una carita nueva en el Marketplace 🎈
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
