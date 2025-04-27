import { useEffect, useState } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

function PlayerResultRoom({ matchId, finalTime }) {
        const { connect, send, close } = useWebSocketContext();
        const [results, setResults] = useState([]);
        const [match, setMatch] = useState(null);
        const adminId = 1; //Harcodeado
      
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
      
        const fetchMatch = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`);
                const data = await response.json();
                setMatch(data);
            } catch (error) {
                console.error('Error al cargar la partida:', error);
            } 
        }
        fetchMatch();
        return () => {
            close();
          };
        }, [matchId, connect, send, close]);
        const calculateTimeSpent = (start, end) => {
            const startTime = new Date(start).getTime();
            const endTime = new Date(end).getTime();
            const totalSeconds = Math.floor((endTime - startTime) / 1000);
        
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
        
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          };

  return (
    <>
      <h1>Clasificación de la partida</h1>
      <ol>
        {results.map((r, index) => (
          <li key={index}>
            {r.playerName} - {calculateTimeSpent(match.startDatetime, r.finalTime)}
          </li>
        ))}
      </ol>
    </>
  )
}

export default PlayerResultRoom;