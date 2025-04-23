import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LobbiesTable from '../components/lobbies/LobbiesTable';
import LobbiesForm from '../components/lobbies/LobbiesForm';

function Lobbies() {
    const [lobbies, setLobbies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lobbyNewName, setLobbyNewName] = useState('');
    const [selectedLobby, setSelectedLobby] = useState('');
    const [view, setView] = useState('table');
    const [action, setAccion] = useState('');
    const [preselectedGameIds, setPreselectedGameIds] = useState([]);
    const [match, setMatch] = useState('');
    const navigate = useNavigate();

    const adminId = 1;//harcodeado a la espera de un login

    useEffect(() => {
        const fetchLobbies = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies`);
                const data = await response.json();
                setLobbies(data);
            } catch (error) {
                console.error('Error al obtener los lobbies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLobbies();
    }, []);

    if (loading) return <p>Cargando salas...</p>;

    const handleSubmit = (formData) => {
        if (action === 'Crear') createLobby(formData);
        else if (action === 'Editar') editLobby(selectedLobby, formData);
      };
    const handleCreateLobby = () => {
        setLobbyNewName('');
        setSelectedLobby('');        
        setPreselectedGameIds([]);
        setAccion('Crear');
        setView('form');
    }
    const createLobby = async (formData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    gameIds: formData.gameIds
                })
            });
            const createdLobby = await response.json();
            setLobbies([...lobbies, createdLobby]);
            setLobbyNewName('');
            setView('table');
        } catch (error) {
            console.error('Error al crear la sala:', error);
        }
    };
    const handleViewMatches = (lobbyId) => {
        navigate(`/lobbies/${lobbyId}/matches`);
    };
    
    const handleCreateMatch = async (lobby) => {
        console.log(lobby);
        const newMatch = await createMatch(lobby);
        if (newMatch) {
            navigate(`/matches/${newMatch.id}/admin`, { state: { match: newMatch } });
        }
    };
    const createMatch = async (lobby) => {
        console.log(lobby);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lobbyId: lobby
                })
            });
            const newMatch = await response.json();
            console.log(newMatch);
            setMatch(newMatch);
            return newMatch;
        } catch (error) {
            console.error('Error al crear la partida:', error);
        }
    }
    const handleEditLobby = (lobby) => {
        setLobbyNewName(lobby.name);
        setSelectedLobby(lobby);
        setPreselectedGameIds(lobby.gameIds);
        setAccion('Editar');
        setView('form');
    }

    const editLobby = async (lobby, formData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies/${lobby.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    gameIds: formData.gameIds
                })
            });
            const updatedLobby = await response.json();
            setLobbies(lobbies.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)));
            setLobbyNewName('');
            setView('table');
        } catch (error) {
            console.error('Error al editar la sala:', error);
        }
    };

    const handleDeleteLobby = async (lobbyId) => {
        const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar esta sala?');
        if (confirmacion) {
            try {
                await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies/${lobbyId}`, {
                    method: 'DELETE',
                });
                setLobbies(lobbies.filter((lobby) => lobby.id !== lobbyId));
            } catch (error) {
                console.error('Error al eliminar la sala:', error);
            }
        }
    };
    return (
        <div>
            <h1>Gestionar salas</h1>
            {view === 'table' && 
                <LobbiesTable 
                    lobbies={lobbies} 
                    onCreate={handleCreateLobby} 
                    onEdit={handleEditLobby} 
                    onDelete={handleDeleteLobby}
                    onViewMatches={handleViewMatches}
                    onCreateMatch={handleCreateMatch}
                />
            }
            {view === 'form' && (
                <LobbiesForm
                    key={action === 'Crear' ? 'new' : selectedLobby?.id}
                    action={action}
                    lobbyName={lobbyNewName}
                    setLobbyName={setLobbyNewName}
                    onSubmit={handleSubmit}
                    onCancel={() => { 
                        setView('table');
                    }}
                    initialSelectedGames={preselectedGameIds}
                />
            )}
        </div>
    );
};

export default Lobbies;
