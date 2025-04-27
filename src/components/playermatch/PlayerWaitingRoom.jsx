import { useEffect, useState } from 'react'
import { useWebSocketContext } from '../../contexts/WebSocketContext';

function PlayerWaitingRoom(props) {

  const [players, setPlayers] = useState([]);
  const { connect, send, close } = useWebSocketContext();

  useEffect(() => {
    const socket = connect(
      props.matchId,
      (data) => {
        if (data.type === "PLAYER_LIST") {
          setPlayers(data.payload);
        }
        if (data.type === "NEW_PLAYER_JOINED") {
          send({ type: "GET_PLAYERS" });
        }
        if(data.type === "START_MATCH") {
          if (props.onStartMatch) props.onStartMatch();
        }
      },
      () => {
        send({ type: "GET_PLAYERS" });
      }
    );

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