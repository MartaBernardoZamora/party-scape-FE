import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PlayerWaitingRoom from '../components/playermatch/PlayerWaitingRoom'
import PlayRoom from '../components/playermatch/PlayRoom'


function PlayerMatch() {
    const location = useLocation();

    const matchId = location.state;

    const [view, setView] = useState('waiting');
    const handleStartMatch = () => {
      setView('inProgress');
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
            />
        }
    </>
  )
}

export default PlayerMatch