import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import FavorDetail from './pages/FavorDetail';
import PedirFavor from './pages/PedirFavor';
import EnProgreso from './pages/EnProgreso';
import Impacto from './pages/Impacto';

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/marketplace" element={<PageWrap><Marketplace /></PageWrap>} />
          <Route path="/favor/:id" element={<PageWrap><FavorDetail /></PageWrap>} />
          <Route path="/pedir" element={<PageWrap><PedirFavor /></PageWrap>} />
          <Route path="/progreso" element={<PageWrap><EnProgreso /></PageWrap>} />
          <Route path="/impacto" element={<PageWrap><Impacto /></PageWrap>} />
          <Route path="*" element={<PageWrap><Home /></PageWrap>} />
      </Routes>
    </>
  );
}
