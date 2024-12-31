import React from 'react';
import './App.css'; // Import the global CSS file
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerSelection from './components/PlayerSelection';
import GameLobby from './components/GameLobby';
import SpotifyAuth from './components/SpotifyAuth';
import BackgroundAnimation from './components/BackgroundAnimation';

const App = () => {
    return (
        <Router>
            <BackgroundAnimation />
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/spotify-auth" element={<SpotifyAuth />} />
                <Route path="/callback" element={<PlayerSelection />} />
                <Route path="/game-lobby" element={<GameLobby />} />
            </Routes>
        </Router>
    );
};

export default App;