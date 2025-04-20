import React, { useEffect, useState } from 'react';
import LobbiesTable from '../components/lobbies/LobbiesTable';
import LobbiesForm from '../components/lobbies/LobbiesForm';

function Lobbies() {
    const [lobbies, setLobbies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lobbyNewName, setLobbyNewName] = useState('');
    const [selectedLobby, setSelectedLobby] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [action, setAccion] = useState('');

    const adminId = 1;//harcodeado a la espera de un login

    useEffect(() => {
        const fetchLobbies = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies`);
                const data = await response.json();
                console.log(data);
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

    const handleSubmit = () => {
        if (action === 'Crear') createLobby();
        else if (action === 'Editar') editLobby(selectedLobby, lobbyNewName);
      };
    const handleCreateLobby = () => {
        setLobbyNewName('');
        setSelectedLobby('');
        setAccion('Crear');
        setShowModal(true);
    }
    const createLobby = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: lobbyNewName,
                    gameIds: [1, 2]//harcodeado a la espera del flujo de game
                })
            });
            const createdLobby = await response.json();
            setLobbies([...lobbies, createdLobby]);
            setLobbyNewName('');
            setShowModal(false);
        } catch (error) {
            console.error('Error al crear la sala:', error);
        }
    };

    const handleEditLobby = (lobby) => {
        setLobbyNewName(lobby.name);
        setSelectedLobby(lobby);
        setAccion('Editar');
        setShowModal(true);
    }

    const editLobby = async (lobby, lobbyNewName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/${adminId}/lobbies/${lobby.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: lobbyNewName,
                    gameIds: [1, 2, 3]//harcodeado a la espera del flujo de game
                })
            });
            const updatedLobby = await response.json();
            console.log(updatedLobby);
            setLobbies(lobbies.map((l) => (l.id === updatedLobby.id ? updatedLobby : l)));
            setLobbyNewName('');
            setShowModal(false);
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
            <LobbiesTable lobbies={lobbies} onCreate={handleCreateLobby} onEdit={handleEditLobby} onDelete={handleDeleteLobby} />
            {showModal && (
                <LobbiesForm
                    action={action}
                    lobbyName={lobbyNewName}
                    setLobbyName={setLobbyNewName}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Lobbies;
