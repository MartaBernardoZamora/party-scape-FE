import { useNavigate } from 'react-router-dom';
import Button from '../components/utils/Button';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Home</h1>
            <Button text="Gestionar salas" onClick={() => navigate("/lobbies")} />
            <Button text="Jugar partida" onClick={() => navigate("/matches")} />
        </div>
    )
}

export default Home