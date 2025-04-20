
import React, { useEffect, useState } from 'react';
import Button from '../utils/Button';

function LobbiesTable(props) {
    return (
        <div>
            <Button text="Crear nueva sala" onClick={props.onCreate}/>
            {props.lobbies.length === 0 ? (
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
                        {props.lobbies.map((lobby) => (
                            <tr key={lobby.id}>
                                <td>{lobby.name}</td>
                                <td>{lobby.gameIds.length}</td>
                                <td>{lobby.matchIds.length}</td>
                                <td>
                                    <Button text="Crear partida" onClick={() => console.log('Crear partida')} disabled/>{/*harcodeado a la espera del flujo de game*/}
                                    <Button text="👀" onClick={() => console.log('Ver partidas')} title="Ver partidas" disabled/>{/*harcodeado a la espera del flujo de game*/}
                                    <Button text="✏️" onClick={() => props.onEdit(lobby)} title="Editar esta sala"/>
                                    <Button text="❌​" onClick={() => props.onDelete(lobby.id)} title="Eliminar esta sala"/>{/*harcodeado a la espera del flujo de game*/}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default LobbiesTable