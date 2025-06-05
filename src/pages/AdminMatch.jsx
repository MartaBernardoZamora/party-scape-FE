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
    const [results, setResults] = useState([]);
    const { connect, send, close } = useWebSocketContext();

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await fetch(`https://party-scape-be.onrender.com/api/v1/admin/${adminId}/matches/${matchId}`);
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
            if (data.type === "PLAYER_VICTORY") {
                setResults((prevResults) => [...prevResults, data.payload]);
            }
        });

        socket.onopen = () => {
            send({ type: "GET_PLAYERS" });
        };

        return () => close();
    }, [matchId]);

    const handleStartMatch = async () => {
        await changeStatusMatch("IN_PROGRESS");
        send({ type: "START_MATCH" });
    }
    const handleCancelMatch = async () => {
        const confirmacion = window.confirm('¿Estas seguro de que quieres cancelar esta partida?');
        if (confirmacion) {
            const cancelled = await changeStatusMatch("CANCELLED");
            if (cancelled) {
                navigate('/lobbies');
            }
        }
    }
    const handleFinishMatch = async () => {
        const confirmacion = window.confirm('¿Estas seguro de que quieres finalizar esta partida?');
        if (confirmacion) {
            const finished = await changeStatusMatch("FINISHED");

            if (finished) {
                navigate('/lobbies');
            }
        }
    }
    const changeStatusMatch = async (statusName) => {
        try {
            const body = {
                status: statusName,
            };
    
            if (statusName === "FINISHED") {
                const partidaFinalizada = new Date();
    
                const finishedPlayers = results.map(result => ({
                    playerName: result.playerName,
                    finalTime: result.finalTime,
                    finished: true,
                }));
    
                const allPlayerNames = players.map(p => p.playerName);
    
                const resultsPlayerNames = results.map(r => r.playerName);
    
                const unfinishedPlayers = allPlayerNames
                    .filter(playerName => !resultsPlayerNames.includes(playerName))
                    .map(playerName => ({
                        playerName,
                        finalTime: partidaFinalizada.toISOString(),
                        finished: false,
                    }));
    
                const completeResults = [...finishedPlayers, ...unfinishedPlayers];
    
                body.results = completeResults;
            }
            await fetch(`https://party-scape-be.onrender.com/api/v1/admin/${adminId}/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            setMatch(prev => ({
                ...prev,
                status: statusName
            }));
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
                {players.map((player, index) => {
                    const playerResult = results.find((r) => r.playerName === player.playerName);

                    return (
                        <li key={index}>
                            {player.playerName} - {playerResult && new Date(playerResult.finalTime).toLocaleTimeString()}
                        </li>
                    );
                })}
            </ul>
            <Button text="⏏️​" onClick={() => handleCancelMatch()} title="Cancelar partida" />
            <Button text="▶️​" onClick={() => handleStartMatch()} title="Iniciar partida" />
            <Button text="​⏹️​" onClick={() => handleFinishMatch()} title="Terminar y guardar datos de partida" />
        </>
    )
}

export default AdminMatch