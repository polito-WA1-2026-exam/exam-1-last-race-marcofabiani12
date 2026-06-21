import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/layout/Header.jsx';
import AuthContext from './contexts/AuthContext.jsx';

import { getUserInfo, logIn, logOut } from './api/authAPI.js';
import { getStations, getSegments } from './api/networkAPI';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import GamePage from './pages/GamePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [stations, setStations] = useState([]);
    const [segments, setSegments] = useState([]);
    const [networkError, setNetworkError] = useState('');

    // Reset all client-side authenticated state
    // Useful after logout or when the server session is no longer valid
    function clearAuth() {
        setUser(null);
        setLoggedIn(false);
        setStations([]);
        setSegments([]);
        setNetworkError('');
    }

    useEffect(() => {
        getUserInfo()
            .then(user => {
                setUser(user);
                setLoggedIn(true);
            })
            .catch(() => {
                clearAuth();
            });
    }, []);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        const fullMap = new Image();
        fullMap.src = '/maps/full-map.png';
        
        const stationsOnlyMap = new Image();
        stationsOnlyMap.src = '/maps/stations-only.png';
    }, [loggedIn]);
    
    // The underground network is immutable
    // Stations and segments are fetched only once and then shared by every
    // game instance and phase, avoiding repeated requests for the same data
    useEffect(() => {
        if (!loggedIn) {
            setStations([]);
            setSegments([]);
            setNetworkError('');
            return;
        }

        // Prevent stale API responses from updating state after logout or effect cleanup
        let cancelled = false;

        const loadNetwork = async () => {
            setNetworkError('');

            try {
                const [stationsData, segmentsData] = await Promise.all([
                    getStations(),
                    getSegments()
                ]);

                if (!cancelled) {
                    setStations(stationsData);
                    setSegments(segmentsData);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setStations([]);
                    setSegments([]);
                    setNetworkError('Unable to load the underground network.');
                }
            }
        };

        loadNetwork();

        return () => {
            cancelled = true;
        };
    }, [loggedIn]);

    async function login(credentials) {
        const user = await logIn(credentials);
        setUser(user);
        setLoggedIn(true);
        return user;
    }

    async function logout() {
        try {
            await logOut();
        } catch (err) {
            console.error(err);
        } finally {
            // The local auth state must be cleared even if the server session
            // has already expired or the logout request fails
            clearAuth();
        }
    }

    return (
        <AuthContext.Provider value={{ user, loggedIn, login, logout, clearAuth }}>
            <div className="app-shell min-vh-100 d-flex flex-column">
                <Header />

                <Container className="flex-grow-1 pt-2 pb-3">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/login"
                            element={loggedIn ? <Navigate replace to="/" /> : <LoginPage />}
                        />
                        <Route
                            path="/ranking"
                            element={loggedIn ? <RankingPage /> : <Navigate replace to="/login" />}
                        />
                        <Route
                            path="/game"
                            element={loggedIn ?
                                <GamePage 
                                    stations={stations}
                                    segments={segments}
                                    networkError={networkError}
                                /> :
                                <Navigate replace to="/login" />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Container>
            </div>
        </AuthContext.Provider>
    );
}

export default App;