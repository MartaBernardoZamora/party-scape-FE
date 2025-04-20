import React, { useEffect, useState } from 'react';

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

    const handleCreateLobby = () => {
        setLobbyNewName('');
        setSelectedLobby(lobby);
        setAccion('Crear');
        setShowModal(true);
    }
    const createLobby = async () => {
        console.log(lobbyNewName);
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
        console.log(lobbyNewName);
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
            <button id="create-lobby-button" onClick={handleCreateLobby}>Crear nueva sala</button>
            {lobbies.length === 0 ? (
                <p>No hay salas disponibles.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Juegos vinculados</th>
                            <th>Partidas creadas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lobbies.map((lobby) => (
                            <tr key={lobby.id}>
                                <td>{lobby.name}</td>
                                <td>{lobby.gameIds.length}</td>
                                <td>{lobby.matchIds.length}</td>
                                <td>
                                    <button disabled>Crear partida</button>
                                    <button title="Ver partidas" disabled>👀</button>
                                    <button title="Editar esta sala" onClick={() => handleEditLobby(lobby)}>✏️​</button>
                                    <button id="delete-button" title="Eliminar esta sala" onClick={() => handleDeleteLobby(lobby.id)}>❌​</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showModal && (
                <div>
                    <div>
                        <h2>{action} sala</h2>
                        <input
                            type="text"
                            placeholder="Nombre de la sala"
                            value={lobbyNewName}
                            onChange={(e) => setLobbyNewName(e.target.value)}
                        />
                        <div style={{ marginTop: 10 }}>
                            <button onClick={() => {
                                if (action === 'Crear') {
                                    createLobby();
                                } else if (action === 'Editar') {
                                    editLobby(selectedLobby, lobbyNewName);
                                }
                            }}>{action}</button>
                            <button onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lobbies;
