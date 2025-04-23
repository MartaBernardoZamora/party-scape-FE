import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MatchesTable from '../components/matches/MatchesTable'

function Matches() {
    const { lobbyId } = useParams();
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const adminId = 1; // Harcoded admin ID

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies/${lobbyId}`);
                const data = await response.json();
                setLobby(data);

                const matchesResponse = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches?lobbyId=${lobbyId}`);
                const matchesData = await matchesResponse.json();
                setMatches(matchesData);
            } catch (error) {
                console.error('Error al cargar la sala o las partidas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLobby();
    }, [lobbyId, matches]);
    

    const handleDeleteMatch = async (matchId) => {
        const confirmacion = window.confirm('¿Estas seguro de que quieres eliminar esta partida?');
        if (confirmacion) {
            try {
                await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`, {
                    method: 'DELETE',
                });
                setMatches(matches.filter((match) => match.id !== matchId));
            } catch (error) {
                console.error('Error al eliminar la partida:', error);
            }
        }
    };

    if (loading) return <p>Cargando sala...</p>;
    if (!lobby) return <p>No se pudo cargar la sala.</p>;
    return (
        <>
            <h1>Partidas de la sala {lobby.name}</h1>
            <MatchesTable matches = {matches} onDeleteMatch={handleDeleteMatch}/>
        </>
    )
}

export default Matches