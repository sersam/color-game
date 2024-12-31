import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerSelection.css'; // Import the CSS file

const parsedHash = new URLSearchParams(
    window.location.hash.substring(1) // any_hash_key=any_value
  );

const PlayerSelection = () => {
    const [players, setPlayers] = useState(['']); // Initialize with one empty player name
    const navigate = useNavigate();

    const handleAddPlayer = () => {
        setPlayers([...players, '']); // Add a new empty string for a new player
    };

    const handlePlayerChange = (index, value) => {
        const newPlayers = [...players];
        newPlayers[index] = value; // Update the player name at the specified index
        setPlayers(newPlayers);
    };

    const handleStartGame = () => {
        navigate('/game-lobby', { state: { players, accessToken: parsedHash.get('access_token') } });
    };

    return (
        <div className="container"> {/* Apply container class for styling */}
            <h1>Introduce los nombres de los jugadores</h1>
            {players.map((player, index) => (
                <input 
                    key={index} 
                    type="text" 
                    value={player} 
                    onChange={(e) => handlePlayerChange(index, e.target.value)} 
                    placeholder={`Player ${index + 1} Name`} 
                />
            ))}
            <button onClick={handleAddPlayer}>Añadir jugador</button>
            <button onClick={handleStartGame} disabled={players.some(name => name.trim() === '')}>¡Empezar a jugar!</button> {/* Disable if any name is empty */}
        </div>
    );
};

export default PlayerSelection;