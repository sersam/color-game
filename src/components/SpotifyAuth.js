import React, { useEffect } from 'react';
import './SpotifyAuth.css';

const SpotifyAuth = () => {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const SCOPES = 'user-modify-playback-state streaming';
    const RESPONSE_TYPE = 'token';

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
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
            <h1>Spotify Authentication</h1>
            <p>To play the game you need to connect to your Spotify Account</p>
            <h2>Spotify Premium is needed</h2>
            <button onClick={handleLogin}>Connect with Spotify</button>
        </div>
    );
};

export default SpotifyAuth;