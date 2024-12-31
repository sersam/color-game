import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GameBoard from './GameBoard'; // Import the GameBoard component
import ColorCircle from './ColorCircle'; // Import the ColorCircle component
import './GameLobby.css'; // Import the CSS file

// Define the available colors
const availableColors = [
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FFEB3B'  // Yellow
];

const genres = [
    'pop',
    'rock',
    'rap',
    'metal'
];

const releaseYears = [
    '1920-1930',
    '1930-1940',
    '1940-1950',
    '1950-1960',
    '1960-1970',
    '1970-1980',
    '1980-1990',
    '1990-2000',
    '2000-2010',
    '2010-2020',
    '2020-2025'
]

const GameLobby = () => {
    const location = useLocation();
    const { players, accessToken } = location.state; // Get player names from state
    const numPlayers = players.length; // Number of players
    const [currentPlayer, setCurrentPlayer] = useState(0); // Track the current player
    const [boards, setBoards] = useState(Array.from({ length: numPlayers }, () => generateBoard())); // Create boards for each player
    const [markedCells, setMarkedCells] = useState(Array.from({ length: numPlayers }, () => Array.from({ length: 5 }, () => Array(5).fill(false)))); // Track marked cells for each player
    const [activeColor, setActiveColor] = useState(null); // Track the active color for the current player
    const [isPlaying, setIsPlaying] = useState(false); // Track if the game is in play
    const [songs, setSongs] = useState([]); // State to hold fetched songs
    const [audioRef, setAudioRef] = useState(null); // State to hold the audio element
    const [currentSong, setCurrentSong] = useState(null); // State to hold the currently playing song details
    const [winner, setWinner] = useState(null); // State to hold the winner
    const playerRef = useRef(null); // Ref to hold the Spotify player
    const deviceIdRef = useRef(null); // Ref to hold the device ID

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Color Game Player',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                playerRef.current = player;
                deviceIdRef.current = device_id;
            });

            player.addListener('not_ready', ({ device_id }) => {
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error('Failed to initialize', message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error('Failed to authenticate', message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account', message);
            });

            player.addListener('playback_error', ({ message }) => {
                console.error('Failed to perform playback', message);
            });

            player.connect();
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.disconnect();
            }
        };
    }, [accessToken]);

    const fetchRandomSongs = async () => {
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const randomYears = releaseYears[Math.floor(Math.random() * releaseYears.length)];

        const query = `${randomGenre} year:${randomYears}`;
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&market=ES&limit=50`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        const filteredSongs = data.tracks.items.filter(track => track.popularity >= 60);
        setSongs(filteredSongs);

        return data.tracks.items;
    };

    const handleNextPlayer = () => {
        setCurrentPlayer((prev) => (prev + 1) % numPlayers); // Switch to the next player
        setActiveColor(null); // Reset active color when switching players
        setIsPlaying(false); // Reset playing state
        if (audioRef) {
            audioRef.pause(); // Pause the audio when switching players
        }
    };

    const checkWinner = (cells) => {
        for (let row of cells) {
            if (row.every(cell => cell)) {
                return true;
            }
        }
        return false;
    };

    const handleCellClick = (rowIndex, colIndex) => {
        // Toggle the marked state of the clicked cell for the current player
        const newMarkedCells = markedCells.map((cells, index) =>
            index === currentPlayer
                ? cells.map((row, rIndex) =>
                    row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? !cell : cell))
                )
                : cells // Keep other players' marked cells unchanged
        );
        setMarkedCells(newMarkedCells); // Update the marked cells state

        if (checkWinner(newMarkedCells[currentPlayer])) {
            setWinner(players[currentPlayer]);
        }
    };

    const handlePlay = async () => {
        const songs = await fetchRandomSongs();
        setIsPlaying(true);
        if (songs.length > 0) {
            const songIndex = Math.floor(Math.random() * songs.length); // Pick a random song
            const selectedSong = songs[songIndex]; // Get the randomly selected song
            setCurrentSong(selectedSong); // Set the current song details

            if (playerRef.current && deviceIdRef.current) {
                const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: [selectedSong.uri]
                    })
                });

                if (response.status === 204) {
                    playerRef.current.resume();
                }
            }
        }
    }

    const handleColorSelected = (color) => {
        setActiveColor(color.hex); // Set the active color based on the selected color
    };

    return (
        <div className="container">
            <div className="card">
                {winner ? (
                    <h1>{winner} is the winner!</h1>
                ) : (<>

                    <h1>Player {players[currentPlayer]}</h1>
                    <div className='game-controls'>
                        <button onClick={handleNextPlayer}>Next Player</button>
                        {!isPlaying ?
                            <button className="play-button" onClick={handlePlay}>
                                <i className="fas fa-play"></i>
                            </button>
                            :
                            <ColorCircle onColorSelected={handleColorSelected} isPlaying={isPlaying} currentSong={currentSong} />
                        }
                    </div>

                    <GameBoard
                        board={boards[currentPlayer]}
                        currentPlayer={players[currentPlayer]}
                        markedCells={markedCells[currentPlayer]} // Pass the current player's marked cells
                        onCellClick={handleCellClick} // Pass the cell click handler
                        activeColor={activeColor} // Pass the active color
                        isPlaying={isPlaying} // Pass the playing state
                    /></>)}
            </div>
        </div>
    );
};

// Function to generate a 5x5 board with predefined colors
const generateBoard = () => {
    return Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => getRandomColor())
    );
};

// Function to randomly select a color from the available colors
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex]; // Return a random color from the available colors
};

export default GameLobby;