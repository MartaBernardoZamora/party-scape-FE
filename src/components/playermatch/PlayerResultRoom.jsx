import { useEffect, useState } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

function PlayerResultRoom({ matchId, finalTime }) {
        const { connect, send, close } = useWebSocketContext();
        const [results, setResults] = useState([]);
      
        useEffect(() => {
          const socket = connect(
            matchId,
            (data) => {
              if (data.type === "RESULTS_LIST") {
                setResults(data.payload);
              }
              if (data.type === "PLAYER_VICTORY") {
                setResults((prevResults) => [...prevResults, data.payload]);
              }
            },
            () => {
              send({ type: "GET_RESULTS" });
            }
          );
      
          return () => {
            close();
          };
        }, [matchId, connect, send, close]);

  return (
    <>
      <p>Tu tiempo final: {finalTime.toLocaleTimeString()}</p>
      <h1>Resultados de la partida</h1>
      <ul>
        {results.map((r, index) => (
          <li key={index}>
            {r.playerName} - {new Date(r.finalTime).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </>
  )
}

export default PlayerResultRoom;