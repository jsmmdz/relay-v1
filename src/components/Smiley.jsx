import caritaFeliz from '../assets/carita-feliz.png';

// Mascota RELAY: carita feliz oficial (PNG de la carpeta IMAGENES).
// `size` controla el ancho; `withHand` se mantiene por compatibilidad
// (la imagen oficial ya incluye la mano en señal de paz).
export default function Smiley({ size = 220, withHand = true, style, className }) {
  return (
    <img
      src={caritaFeliz}
      width={size}
      className={className}
      style={{ height: 'auto', userSelect: 'none', ...style }}
      alt=""
      draggable="false"
    />
  );
}
