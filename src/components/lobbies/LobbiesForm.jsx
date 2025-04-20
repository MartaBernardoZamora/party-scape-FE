import { useEffect, useState } from "react";
import Button from "../utils/Button";

function LobbiesForm(props) {
    const [games, setGames] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/games`);
                const data = await response.json();
                setGames(data);
                if (props.initialSelectedGames?.length > 0) {
                    setSelectedGames(props.initialSelectedGames);
                }
            } catch (error) {
                console.error('Error al obtener los juegos:', error);
            }
        };

        fetchGames();
    }, []);

    return (
        <div>
            <div>
                <h2>{props.action} sala</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        props.onSubmit({
                            name: props.lobbyName,
                            gameIds: selectedGames
                        });
                    }}
                >
                    <input
                        type="text"
                        placeholder="Nombre de la sala"
                        value={props.lobbyName??""}
                        onChange={(e) => props.setLobbyName(e.target.value)}
                    />
                    <div>
                        <h3>Selecciona un juego</h3>
                        <ul>
                            {selectedGames.map((gameId) => {
                                const game = games.find(g => g.id === gameId);
                                return (
                                    <li key={gameId}>
                                        {game.name}
                                        <Button
                                            text="❌​"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedGames(selectedGames.filter((id) => id !== gameId));
                                            }}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <select
                            value={currentSelection}
                            onChange={(e) => setCurrentSelection(e.target.value)}
                        >
                            <option value="">Selecciona un juego</option>
                            {games.filter((game) => !selectedGames.includes(game.id))
                                    .map((game) => (
                                        <option key={game.id} value={game.id}>
                                            {game.name}
                                        </option>
                            ))}
                        </select>
                        <Button
                            text="Agregar juego"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentSelection && !selectedGames.includes(currentSelection)) {
                                    setSelectedGames([...selectedGames, Number(currentSelection)]);
                                    setCurrentSelection("");
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Button text={props.action} type="submit" />
                        <Button text="Cancelar" onClick={() => props.onCancel()} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LobbiesForm