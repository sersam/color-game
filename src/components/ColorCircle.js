import React, { useEffect, useState } from 'react';
import './ColorCircle.css'; // Import the CSS file for styling

const colors = [
    { name: 'Purple', hex: '#9C27B0', description: "Guess the decade of the song" },
    { name: 'Pink', hex: '#E91E63', description: "Before/After of 2000s" },
    { name: 'Blue', hex: '#2196F3', description: "Year of the song (+- 2 years)" },
    { name: 'Green', hex: '#4CAF50', description: "Band or artist" },
    { name: 'Yellow', hex: '#FFEB3B', description: "In which year was released this song?" }
];

const ColorCircle = ({ onColorSelected, isPlaying, currentSong }) => {
    const [currentColor, setCurrentColor] = useState(undefined);
    const [isSelecting, setIsSelecting] = useState(false);
    const [showSongDetails, setShowSongDetails] = useState(false);

    useEffect(() => {
        setShowSongDetails(false);
    }, [currentSong, isPlaying])

    useEffect(() => {
        if (isPlaying)
            startSelection()
    }, [isPlaying])

    useEffect(() => {
        if (isSelecting) {
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * colors.length);
                setCurrentColor(colors[randomIndex]);
            }, 100); // Change color every 100ms

            const timeout = setTimeout(() => {
                clearInterval(interval);
                const selectedColor = colors[Math.floor(Math.random() * colors.length)];
                setCurrentColor(selectedColor);
                onColorSelected(selectedColor); // Pass the selected color back to the parent
                setIsSelecting(false);
            }, 3000); // Stop after 3 seconds

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isSelecting, onColorSelected]);

    const startSelection = () => {
        setIsSelecting(true);
    };

    const handleRevealDetails = () => {
        setShowSongDetails(true);
    }

    return (
        <div>
            <div className="color-circle" onClick={handleRevealDetails} style={{ backgroundColor: currentColor?.hex }}>
                {isSelecting ? <p>Selecting...</p> : <p>Reveal song details</p>}
            </div>
            <h3>
                {!isSelecting && currentColor && <>{currentColor.description}</>}
            </h3>
            {currentSong && (
                <div>
                    {showSongDetails && (
                        <div className="song-details">
                            <p><strong>Song:</strong> {currentSong.name}</p>
                            <p><strong>Artist:</strong> {currentSong.artists[0].name}</p>
                            <p><strong>Release Date:</strong> {new Date(currentSong.album.release_date).getFullYear()}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ColorCircle;