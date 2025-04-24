import { useEffect, useState, useRef } from 'react'
import { useWebSocketContext } from '../../contexts/WebSocketContext';

function PlayerWaitingRoom(props) {

const [players, setPlayers] = useState([]);
const { connect, send, close } = useWebSocketContext();

  useEffect(() => {
    const socket = connect(props.matchId, (data) => {
      console.log("🎯 Recibido:", data);
      if (data.type === "NEW_PLAYER_JOINED") {
        setPlayers(prev => [...prev, data.payload]); 
      }
    });

    return () => close();
  }, [props.matchId]);

    return (
        <>
            <h1>Sala de espera</h1>
            <p>La partida empezará pronto</p>
            <p>Jugadores</p>
            <ul>
                {players.map((p, i) => (
                    <li key={i}>{p.playerName}</li>
                ))}
            </ul>
        </>
    )
}

export default PlayerWaitingRoom