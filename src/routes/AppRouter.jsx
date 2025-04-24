import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Lobbies from '../pages/Lobbies'
import Matches from '../pages/Matches'
import AdminMatch from '../pages/AdminMatch'
import JoinMatch from '../pages/JoinMatch'
import PlayerMatch from '../pages/PlayerMatch'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/lobbies" element={<Lobbies />} />
                <Route path="/lobbies/:lobbyId/matches" element={<Matches />} />
                <Route path="/matches/:matchId/admin" element={<AdminMatch />} />
                <Route path="/matches" element={<JoinMatch />} />
                <Route path="/matches/:code/player" element={<PlayerMatch />} />
            </Route>
        </Routes>
    )
}

export default AppRouter