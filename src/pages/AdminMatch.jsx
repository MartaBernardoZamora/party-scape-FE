import { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Button from '../components/utils/Button';

function AdminMatch() {
    const adminId = 1; // Harcoded admin ID
    const { matchId } = useParams();
    const [match, setMatch] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {        
        const fetchMatch = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`);
                const data = await response.json();
                setMatch(data);
            } catch (error) {
                console.error('Error al cargar la partida:', error);
            }finally {
                setLoading(false);
            }
        }
        fetchMatch();
    }, []);

    const cancelMatch = async () => {
        try {
            await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    gameIds: formData.gameIds
                })
            });
            setMatch(null);
        } catch (error) {
            console.error('Error al actualizar estado de la partida:', error);
        }
    };

    if (loading) return <p>Cargando partida...</p>;

    return (
        <>
            <h1>Administrar partida</h1>
            <p>Código de acceso: {match.joinCode}</p>
            <p>Estado: {match.status}</p>
            <Button text="⏏️​" onClick={() => console.log("cancelo")} title="Cancelar partida"/>
            <Button text="▶️​" onClick={() => console.log("arranco")} title="Iniciar partida"/>
            <Button text="​⏹️​" onClick={() => console.log("termino")} title="Terminar y guardar datos de partida"/>
        </>
    )
}

export default AdminMatch