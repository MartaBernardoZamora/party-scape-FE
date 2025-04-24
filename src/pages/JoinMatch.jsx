import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/utils/Button"
import { useWebSocketContext } from "../contexts/WebSocketContext"


function JoinMatch() {
    const navigate = useNavigate();

    const { send, connect } = useWebSocketContext();

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const adminId = 1; // Harcoded admin ID


    const handleClickPartidas = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches?code=${code}`);

            if (!response.ok) {
                alert("No se encontró la partida con ese código");
                return;
            }

            const matchData = await response.json();

            const socket = connect(matchData.id, (data) => {
                console.log("📩 Mensaje recibido (jugador):", data);
              });
          
              await new Promise((resolve) => {
                if (socket.readyState === WebSocket.OPEN) {
                  resolve();
                } else {
                  socket.onopen = () => {
                    console.log("✅ WebSocket abierto (jugador)");
                    resolve();
                  };
                }
              });
              
              // Ahora ya puedes enviar el mensaje con seguridad
              socket.send(JSON.stringify({
                type: "NEW_PLAYER_JOINED",
                payload: { playerName: name }
              }));

            navigate(`/matches/${code}/player`, { state: matchData.id });

        } catch (error) {
            console.error("Error al unirse a la partida:", error);
        }
    };
    return (
        <div>
            <h1>Unirse a partida</h1>
            <input type="text" placeholder="Código de la partida" value={code} onChange={(e) => setCode(e.target.value)} />
            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Button text="Unirse" onClick={() => { handleClickPartidas() }} />
        </div>
    )
}

export default JoinMatch