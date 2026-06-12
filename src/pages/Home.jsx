import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidBlob from '../components/LiquidBlob';
import './Home.css';
import letraR from '../assets/letra-r.png';
import letraE from '../assets/letra-e.png';
import letraL from '../assets/letra-l.png';
import letraA from '../assets/letra-a.png';
import letraY from '../assets/letra-y.png';
import caritaFeliz from '../assets/carita-feliz.png';

// Letras oficiales del logo (PNG con transparencia de la carpeta IMAGENES)
const LETTERS = [
  { char: 'R', src: letraR },
  { char: 'E', src: letraE },
  { char: 'L', src: letraL },
  { char: 'A', src: letraA },
  { char: 'Y', src: letraY },
];

const CTAS = [
  {
    to: '/marketplace',
    titulo: 'Explora el Marketplace',
    cartel: '¡Hay vecinos que te necesitan! Mira los favores disponibles cerca de ti.',
    boton: 'Ver favores',
  },
  {
    to: '/pedir',
    titulo: 'Pide tu favor',
    cartel: 'Pedir ayuda no cuesta nada. Publica tu favor en menos de un minuto.',
    boton: 'Pedir un favor',
  },
  {
    to: '/impacto',
    titulo: 'Mira el impacto',
    cartel: 'Cada favor crea un lazo. Mira cuánto ha crecido tu comunidad.',
    boton: 'Ver impacto',
  },
];

function CtaBlock({ cta, index }) {
  const [hover, setHover] = useState(false);
  const alignRight = index % 2 === 1;

  return (
    <motion.section
      className={`home-cta ${alignRight ? 'home-cta--right' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 16 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h2 className="home-cta__title">{cta.titulo}</h2>

      <div className="home-cta__action">
        <AnimatePresence>
          {hover && (
            <motion.div
              className="home-cta__reveal"
              initial={{ opacity: 0, y: 40, rotate: -6, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <div className="home-cta__sign">{cta.cartel}</div>
              <img className="home-cta__smiley" src={caritaFeliz} alt="" draggable="false" />
            </motion.div>
          )}
        </AnimatePresence>
        <Link to={cta.to} className="pill pill--yellow pill--big">
          {cta.boton} →
        </Link>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="home-hero">
        <h1 className="home-logo" aria-label="RELAY">
          {LETTERS.map((l, i) => (
            <motion.span
              key={l.char}
              className="home-logo__letter"
              initial={{ y: -120, opacity: 0, rotate: i % 2 ? 8 : -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 11, delay: 0.15 + i * 0.12 }}
            >
              <img className="bubble-letter" src={l.src} alt="" draggable="false" />
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="home-tagline home-tagline--left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Personas Ayudando Personas
        </motion.p>
        <motion.p
          className="home-tagline home-tagline--right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Juntos, Todo Fluye
        </motion.p>
        <motion.p
          className="home-tagline home-tagline--center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          Cada Favor Crea Un Lazo
        </motion.p>

        <motion.div
          className="home-hero__scroll"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </section>

      {/* Transición líquida amarilla */}
      <div className="home-wave" aria-hidden="true">
        <LiquidBlob color="var(--yellow)" variant="bottom" />
      </div>

      {/* CTAs por scroll */}
      <section className="home-ctas">
        {CTAS.map((cta, i) => (
          <CtaBlock key={cta.to} cta={cta} index={i} />
        ))}

        <motion.footer
          className="home-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img className="home-footer__smiley" src={caritaFeliz} alt="" draggable="false" />
          <p>RELAY · Comunidad cerrada · Conjunto Mirador 3</p>
        </motion.footer>
      </section>
    </main>
  );
}
