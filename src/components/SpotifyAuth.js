import React, { useEffect } from 'react';
import './SpotifyAuth.css';

const SpotifyAuth = () => {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-library-read',
        'user-library-modify'
    ];

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const token = hash.split('&')[0].split('=')[1];
            localStorage.setItem('spotify_token', token);
            window.location.hash = '';
        }
    }, []);

    return (
        <div className="spotify-auth-container">
            <h1>Spotify</h1>
            <p>Para jugar al juego es necesario que autorices a la aplicación a usar Spotify</p>
            <h2>Spotify Premium es necesario</h2>
            <button onClick={handleLogin}>Conectar con Spotify</button>
        </div>
    );
};

export default SpotifyAuth;