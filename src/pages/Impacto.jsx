import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRelay } from '../context/RelayContext';
import Smiley from '../components/Smiley';
import LiquidBlob from '../components/LiquidBlob';
import './Impacto.css';

function StatBubble({ valor, label, color, delay = 0 }) {
  return (
    <motion.div
      className="impacto__stat"
      style={{ background: color }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 150, damping: 13, delay }}
    >
      <span className="impacto__shine" aria-hidden="true" />
      <strong className="impacto__num">{valor}</strong>
      <span className="impacto__label">{label}</span>
    </motion.div>
  );
}

export default function Impacto() {
  const { favores, finalizados, enProgreso, reiniciarDemo } = useRelay();

  // Métricas simuladas de la comunidad + actividad real de la sesión
  const base = { completados: 47, lazos: 132, vecinos: 28 };
  const completados = base.completados + finalizados.length;
  const lazos = base.lazos + finalizados.length * 2 + enProgreso.length;
  const activos = favores.filter((f) => f.estado === 'publicado').length;

  return (
    <main className="page impacto">
      <div className="impacto__blob" aria-hidden="true">
        <LiquidBlob color="var(--green)" variant="top" />
      </div>

      <header className="impacto__head">
        <motion.h1 initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }}>
          Impacto
        </motion.h1>
        <motion.p
          className="impacto__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Cada favor crea un lazo. Esto ha tejido tu comunidad.
        </motion.p>
      </header>

      <section className="impacto__stats">
        <StatBubble valor={completados} label="Favores completados" color="var(--lime)" />
        <StatBubble valor={lazos} label="Lazos (nudos) creados" color="var(--lilac-light)" delay={0.12} />
        <StatBubble valor={base.vecinos} label="Vecinos participando" color="var(--green-mid)" delay={0.24} />
        <StatBubble valor={activos} label="Favores esperando" color="var(--yellow)" delay={0.36} />
      </section>

      <motion.section
        className="impacto__cta"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Smiley size={170} />
        <div className="impacto__cta-text">
          <h2>El siguiente lazo puede ser tuyo</h2>
          <div className="impacto__cta-actions">
            <Link to="/marketplace" className="pill pill--solid pill--big">
              Ayudar con un favor
            </Link>
            <Link to="/pedir" className="pill pill--yellow pill--big">
              Pedir un favor
            </Link>
          </div>
        </div>
      </motion.section>

      <button className="impacto__reset" onClick={reiniciarDemo} title="Restaurar datos de demostración">
        ↺ Reiniciar demo
      </button>
    </main>
  );
}
