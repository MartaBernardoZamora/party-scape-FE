import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Lobbies from '../pages/Lobbies'
import Matches from '../pages/Matches'
import AdminMatch from '../pages/AdminMatch'
import JoinMatch from '../pages/JoinMatch'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/lobbies" element={<Lobbies />} />
                <Route path="/lobbies/:lobbyId/matches" element={<Matches />} />
                <Route path="/matches/:matchId/admin" element={<AdminMatch />} />
                <Route path="/matches" element={<JoinMatch />} />
            </Route>
        </Routes>
    )
}

export default AppRouter