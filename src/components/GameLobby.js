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

const decades = [
    '1920-1929',
    '1930-1939',
    '1940-1949',
    '1950-1959',
    '1960-1969',
    '1970-1979',
    '1980-1989',
    '1990-1999',
    '2000-2009',
    '2010-2019',
    '2020-2029'
];

const GameLobby = () => {
    const location = useLocation();
    const { players, accessToken } = location.state; // Get player names from state
    const numPlayers = players.length; // Number of players
    const [currentPlayer, setCurrentPlayer] = useState(0); // Track the current player
    const [boards,] = useState(Array.from({ length: numPlayers }, () => generateBoard())); // Create boards for each player
    const [markedCells, setMarkedCells] = useState(Array.from({ length: numPlayers }, () => Array.from({ length: 5 }, () => Array(5).fill(false)))); // Track marked cells for each player
    const [activeColor, setActiveColor] = useState(null); // Track the active color for the current player
    const [isPlaying, setIsPlaying] = useState(false); // Track if the game is in play
    const [songs, setSongs] = useState([]); // State to hold fetched songs
    const [audioRef,] = useState(null); // State to hold the audio element
    const [currentSong, setCurrentSong] = useState(null); // State to hold the currently playing song details
    const [winner, setWinner] = useState(null); // State to hold the winner
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const playerRef = useRef(null); // Ref to hold the Spotify player
    const deviceIdRef = useRef(null); // Ref to hold the device ID

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        script.onload = () => {
            console.log('Spotify SDK script loaded');
        };
        script.onerror = () => {
            console.error('Failed to load Spotify SDK script');
        };
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Color Game Player',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                playerRef.current = player;
                deviceIdRef.current = device_id;
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
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

            player.connect().then(success => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            });
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.disconnect();
            }
        };
    }, [accessToken]);

    const getRandomSearchTerm = () => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        return randomLetter;
    };

    const fetchSongsByDecade = async (decade, minPopularity = 50) => {
        let allSongs = [];
        let offset = 0;
        const limit = 50; // Maximum limit per request

        const randomSearchTerm = getRandomSearchTerm();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${randomSearchTerm}%20year:${decade}&type=track&market=ES&limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        const filteredSongs = data.tracks.items.filter(track => track.popularity >= minPopularity);
        allSongs = [...allSongs, ...filteredSongs];
        offset += limit;

        return allSongs.slice(0, 50); // Return only the first 50 songs
    };

    const fetchAllSongs = async () => {
        setIsLoading(true); // Set loading to true before fetching
        let allFetchedSongs = [];
        for (const decade of decades) {
            const songs = await fetchSongsByDecade(decade);
            allFetchedSongs = [...allFetchedSongs, ...songs];
        }
        setSongs(allFetchedSongs);

        const songsByYear = allFetchedSongs.reduce((acc, song) => {
            const releaseYear = new Date(song.album.release_date).getFullYear();
            if (acc[releaseYear]) {
                acc[releaseYear]++;
            } else {
                acc[releaseYear] = 1;
            }
            return acc;
        }, {});

        console.log(songsByYear); // Log the object to verify the result
        setIsLoading(false); // Set loading to false after fetching
    };
    useEffect(() => {
        fetchAllSongs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            setSongs(prevSongs => prevSongs.filter(s => s.uri !== selectedSong.uri));
        }
    }

    const handleColorSelected = (color) => {
        setActiveColor(color.hex); // Set the active color based on the selected color
    };

    return (
        <div className="container">
            {isLoading ?
                <div className="loading-mask">
                    <div className="spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p>Obteniendo canciones...</p>
                </div> : (
                    <div className="card">
                        {winner ? (
                            <h1>¡{winner} ha ganado!</h1>
                        ) : (<>

                            <h1>Jugador {players[currentPlayer]}</h1>
                            <div className='game-controls'>
                                <button onClick={handleNextPlayer}>Siguiente jugador</button>
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
                                markedCells={markedCells[currentPlayer]} // Pass the current player's marked cells
                                onCellClick={handleCellClick} // Pass the cell click handler
                                activeColor={activeColor} // Pass the active color
                            /></>)}
                    </div>)}

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