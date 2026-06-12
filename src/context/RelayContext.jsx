import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_FAVORES, FASES } from '../data/seed';

const RelayContext = createContext(null);

// v2: nueva semilla de 17 favores (descarta datos de prueba de la v1)
const STORAGE_KEY = 'relay-favores-v2';
const USUARIO_ACTUAL = 'Tú';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // storage corrupto o bloqueado: arrancamos con la semilla
  }
  return SEED_FAVORES;
}

export function RelayProvider({ children }) {
  const [favores, setFavores] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favores));
    } catch {
      // sin persistencia disponible; la sesión sigue funcionando en memoria
    }
  }, [favores]);

  const publicarFavor = (favor) => {
    const nuevo = {
      ...favor,
      id: `f${Date.now()}`,
      usuario: USUARIO_ACTUAL,
      estado: 'publicado',
      mensajes: [],
    };
    setFavores((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const aceptarFavor = (id) => {
    setFavores((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              estado: 'aceptado',
              ayudante: USUARIO_ACTUAL,
              mensajes: f.mensajes ?? [],
            }
          : f
      )
    );
  };

  // Avanza Aceptado → Coordinando → En curso → Finalizado
  const avanzarFavor = (id) => {
    setFavores((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const orden = ['aceptado', 'coordinando', 'en curso', 'finalizado'];
        const i = orden.indexOf(f.estado);
        if (i === -1 || i === orden.length - 1) return f;
        return { ...f, estado: orden[i + 1] };
      })
    );
  };

  const completarFavor = (id) => {
    setFavores((prev) =>
      prev.map((f) => (f.id === id ? { ...f, estado: 'finalizado' } : f))
    );
  };

  // Cancelar devuelve el favor al marketplace (vuelve a "publicado")
  const cancelarFavor = (id) => {
    setFavores((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, estado: 'publicado', ayudante: undefined, fecha: 'Por coordinar' }
          : f
      )
    );
  };

  const reprogramarFavor = (id, nuevaFecha) => {
    setFavores((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, fecha: nuevaFecha, estado: 'coordinando' } : f
      )
    );
  };

  const enviarMensaje = (id, texto) => {
    setFavores((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              mensajes: [
                ...(f.mensajes ?? []),
                { de: USUARIO_ACTUAL, texto, hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) },
              ],
            }
          : f
      )
    );
  };

  const reiniciarDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setFavores(SEED_FAVORES);
  };

  const value = useMemo(() => {
    const disponibles = favores.filter((f) => f.estado === 'publicado');
    const enProgreso = favores.filter((f) =>
      ['aceptado', 'coordinando', 'en curso'].includes(f.estado)
    );
    const finalizados = favores.filter((f) => f.estado === 'finalizado');
    return {
      favores,
      disponibles,
      enProgreso,
      finalizados,
      publicarFavor,
      aceptarFavor,
      avanzarFavor,
      completarFavor,
      cancelarFavor,
      reprogramarFavor,
      enviarMensaje,
      reiniciarDemo,
      FASES,
      usuarioActual: USUARIO_ACTUAL,
    };
  }, [favores]);

  return <RelayContext.Provider value={value}>{children}</RelayContext.Provider>;
}

export function useRelay() {
  const ctx = useContext(RelayContext);
  if (!ctx) throw new Error('useRelay debe usarse dentro de <RelayProvider>');
  return ctx;
}
