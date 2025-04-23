import { useEffect, useState } from 'react'
import Button from '../utils/Button';

function MatchesTable(props) {
    const [matches, setMatches] = useState(null);
    const [loading, setLoading] = useState(true);
    const adminId = 1; // Harcoded admin ID

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches?lobbyId=${props.lobbyId}`);
                const data = await response.json();
                setMatches(data);
            } catch (error) {
                console.error('Error al cargar la sala:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [props.lobbyId]);

    if (loading) return <p>Cargando tabla...</p>;
    if (!matches) return <p>No se pudo cargar la tabla.</p>;

    return (
        <>
            {matches.length === 0 ? (
                <p>No hay partidas en esta sala.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código de partida</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match) => (
                            <tr key={match.id}>
                                <td>{match.id}</td>
                                <td>{match.joinCode}</td>
                                <td>{match.status}</td>
                                <td>
                                    <Button text="👀" onClick={() => console.log('Ver datos')} title="Ver datos" disabled={match.status !== 'FINISHED'}/>
                                    <Button text="❌" onClick={() => console.log('Eliminar partida')} title="Eliminar partida" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default MatchesTable