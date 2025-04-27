import { useEffect, useState, useRef, Suspense, lazy} from 'react';
import Button from '../utils/Button';

function PlayRoom() {
  const canvasRef = useRef(null);
  const [respuestaOk, setRespuestaOk] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const juegos = import.meta.glob('../games/*.jsx');
  const [nombreJuego, setNombreJuego] = useState(null);
  const [ComponenteJuego, setComponenteJuego] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const alto = 200;
      canvas.width = alto;
      canvas.height = alto;
    }
  }, []);
  useEffect(() => {
    // aquí irá el fetch para ver los juegos de la partida
    setNombreJuego("Game1");
    setRespuestaOk("mogwai");
  }, []);
  useEffect(() => {
    if (nombreJuego) {
      const ruta = `../games/${nombreJuego}.jsx`;
      const importador = juegos[ruta];
  
      if (importador) {
        const LazyGame = lazy(importador);
        setComponenteJuego(() => LazyGame);
      } else {
        console.error(`No existe el juego: ${ruta}`);
      }
    }
  }, [nombreJuego]);
  const submitAnswer = () => {
    if (respuesta?.toLowerCase() === respuestaOk) {
      const ahora = new Date();
      console.log(ahora);
    } else {
      alert('Respuesta incorrecta');
    }
  }
  return (
    <>
      {ComponenteJuego && (
        <Suspense fallback={<p>Cargando juego...</p>}>
          <ComponenteJuego canvasRef={canvasRef} respuesta={respuesta} />
        </Suspense>
      )}
      <canvas ref={canvasRef} className="none"></canvas>
      <input type="text" placeholder='Respuesta' onChange={(e) => { setRespuesta(e.target.value); }} />
      <Button text="Enviar" onClick={submitAnswer} />
    </>
  );
}

export default PlayRoom;
