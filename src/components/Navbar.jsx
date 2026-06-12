import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const LINKS = [
  { to: '/', icon: '✦', label: 'Inicio' },
  { to: '/marketplace', icon: '☻', label: 'Marketplace' },
  { to: '/pedir', icon: '✚', label: 'Pedir favor' },
  { to: '/progreso', icon: '➳', label: 'En progreso' },
  { to: '/impacto', icon: '♥', label: 'Impacto' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      aria-label="Navegación principal"
    >
      <div className="navbar__capsule">
        {LINKS.map(({ to, icon, label }) => {
          const active = pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`navbar__item ${active ? 'is-active' : ''}`}
              aria-label={label}
            >
              <span className="navbar__icon">{icon}</span>
              <span className="navbar__label">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}
