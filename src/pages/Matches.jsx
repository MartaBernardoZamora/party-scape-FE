import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MatchesTable from '../components/matches/MatchesTable'

function Matches() {
    const { lobbyId } = useParams();
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const adminId = 1; // Harcoded admin ID

    useEffect(() => {
        const fetchLobby = async () => {
            try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies/${lobbyId}`);
            const data = await response.json();
            setLobby(data);
            } catch (error) {
            console.error('Error al cargar la sala:', error);
            } finally {
            setLoading(false);
            }
        };
        fetchLobby();
    }, [lobbyId]);

    if (loading) return <p>Cargando sala...</p>;
    if (!lobby) return <p>No se pudo cargar la sala.</p>;
    return (
        <>
            <h1>Partidas de la sala {lobby.name}</h1>
            <MatchesTable lobbyId={lobby.id}/>
        </>
    )
}

export default Matches