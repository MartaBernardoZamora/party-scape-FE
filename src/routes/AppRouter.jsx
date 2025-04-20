import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Lobbies from '../pages/Lobbies'

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/lobbies" element={<Lobbies />} />
            </Route>
        </Routes>
    )
}

export default AppRouter