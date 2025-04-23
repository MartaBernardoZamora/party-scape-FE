import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/utils/Button"


function JoinMatch() {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [name, setName] = useState("");

    const handleClickPartidas = () => {
        const socket = new WebSocket("ws://localhost:8080/api/v1/ws-matches");

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: "NEW_PLAYER_JOINED",
                payload: {
                    matchCode: code,
                    playerName: name
                }
            }));
        };    

        navigate(`/matches/${code}/player`, { state: { name } });
    }
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