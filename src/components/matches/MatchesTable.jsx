import { useEffect, useState } from 'react'
import Button from '../utils/Button';

function MatchesTable(props) {
    if (!props.matches) return <p>No se pudo cargar la tabla.</p>;
    if (props.matches.length === 0) return <p>No hay partidas en esta sala.</p>;

    return (
        <>
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
                    {props.matches.map((match) => (
                        <tr key={match.id}>
                            <td>{match.id}</td>
                            <td>{match.joinCode}</td>
                            <td>{match.status}</td>
                            <td>
                                <Button text="👀" onClick={() => console.log('Ver datos')} title="Ver datos" disabled={match.status !== 'FINISHED'}/>
                                <Button text="❌" onClick={() => props.onDeleteMatch(match.id)} title="Eliminar partida" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default MatchesTable