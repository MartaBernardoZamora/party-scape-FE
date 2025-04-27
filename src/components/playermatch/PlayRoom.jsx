import { useEffect, useState, useRef, Suspense, lazy} from 'react';
import Button from '../utils/Button';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

function PlayRoom(props) {
  const canvasRef = useRef(null);
  const [respuestaOk, setRespuestaOk] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const juegos = import.meta.glob('../games/*.jsx');
  const [nombreJuego, setNombreJuego] = useState(null);
  const [ComponenteJuego, setComponenteJuego] = useState(null);

  const { send, connect, close } = useWebSocketContext();


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
  useEffect(() => {
    const socket = connect(props.matchId,() => {});
    
    return () => {
      close();
    };
  }, [props.matchId, connect, close]);
  const submitAnswer = () => {
    if (respuesta?.toLowerCase() === respuestaOk) {
      const ahora = new Date();
      props.onVictory(ahora);

      send({
        type: "PLAYER_VICTORY",
        payload: {
          playerName: props.playerName,
          finalTime: ahora.toISOString()
        }
      });

    } else {
      alert('Respuesta incorrecta');
    }
  };
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
