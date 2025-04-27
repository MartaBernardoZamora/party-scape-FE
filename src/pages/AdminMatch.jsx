import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/utils/Button';
import { useWebSocketContext } from '../contexts/WebSocketContext';


function AdminMatch() {
    const adminId = 1; // Harcoded admin ID
    const { matchId } = useParams();
    const [match, setMatch] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const { connect, send, close } = useWebSocketContext();

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`);
                const data = await response.json();
                setMatch(data);
            } catch (error) {
                console.error('Error al cargar la partida:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMatch();
    }, []);

    useEffect(() => {
        const socket = connect(matchId, (data) => {

            if (data.type === "PLAYER_LIST") {
                setPlayers(data.payload);
            }
            if (data.type === "NEW_PLAYER_JOINED") {
                send({ type: "GET_PLAYERS" });
            }
        });

        socket.onopen = () => {
            send({ type: "GET_PLAYERS" });
        };

        return () => close();
    }, [matchId]);

    const handleStartMatch = () => {
        send({ type: "START_MATCH" });
    }
    const handleCancelMatch = async () => {
        const confirmacion = window.confirm('¿Estas seguro de que quieres cancelar esta partida?');
        if (confirmacion) {
            const cancelled = await cancelMatch();
            if (cancelled) {
                navigate('/lobbies');
            }
        }
    }
    const cancelMatch = async () => {
        try {
            await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'CANCELLED'
                })
            });
            return true;
        } catch (error) {
            console.error('Error al actualizar estado de la partida:', error);
        }
    };

    if (loading) return <p>Cargando partida...</p>;

    if (!match) return <p>Partida no encontrada</p>;

    return (
        <>
            <h1>Administrar partida</h1>
            <p>Código de acceso: {match.joinCode}</p>
            <p>Estado: {match.status}</p>
            <p><b>Jugadores:</b></p>
            <ul>
                {players.map((p, i) => (
                    <li key={i}>{p.playerName}</li>
                ))}
            </ul>
            <Button text="⏏️​" onClick={() => handleCancelMatch()} title="Cancelar partida" />
            <Button text="▶️​" onClick={() => handleStartMatch()} title="Iniciar partida" />
            <Button text="​⏹️​" onClick={() => console.log("termino")} title="Terminar y guardar datos de partida" />
        </>
    )
}

export default AdminMatch