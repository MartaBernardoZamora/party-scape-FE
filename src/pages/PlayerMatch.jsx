import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PlayerWaitingRoom from '../components/playermatch/PlayerWaitingRoom'


function PlayerMatch() {
    const location = useLocation();

    const matchId = location.state;

    const [view, setView] = useState('waiting');
  return (
    <>
        {view === 'waiting' && 
            <PlayerWaitingRoom
                matchId={matchId}
            />
        }
    </>
  )
}

export default PlayerMatch