import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PlayerWaitingRoom from '../components/playermatch/PlayerWaitingRoom'
import PlayRoom from '../components/playermatch/PlayRoom'
import PlayerResultRoom from '../components/playermatch/PlayerResultRoom'


function PlayerMatch() {
    const location = useLocation();
    const [finalTime, setFinalTime] = useState(null);

    const {matchId, playerName} = location.state;

    const [view, setView] = useState('waiting');
    const handleStartMatch = () => {
      setView('inProgress');
    };

    const handleVictory = (victoryTime) => {
      setFinalTime(victoryTime);
      setView('results');
    };
  return (
    <>
        {view === 'waiting' && 
            <PlayerWaitingRoom
                matchId={matchId}
                onStartMatch={handleStartMatch}
            />
        }
        {view === 'inProgress' && 
            <PlayRoom
                matchId={matchId}
                playerName={playerName}
                onVictory={handleVictory}
            />
        }
        {view === 'results' && 
            <PlayerResultRoom 
                matchId={matchId}
                finalTime={finalTime}
            />
        }
    </>
  )
}

export default PlayerMatch