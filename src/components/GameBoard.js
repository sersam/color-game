import React from 'react';
import './GameBoard.css';

const GameBoard = ({ board, markedCells, onCellClick, activeColor, isPlaying }) => {
    return (
        <div className="game-board"> {/* Add class for styling */}
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => {
                            const isActiveCell = cell === activeColor; // Check if the cell matches the active color
                            const isMarked = markedCells[rowIndex][colIndex]; // Check if the cell is marked
                            return (
                                <div 
                                    key={colIndex} 
                                    className="cell" 
                                    style={{ 
                                        backgroundColor: cell, 
                                        position: 'relative', 
                                        opacity: !isActiveCell ? 1 : 1, // Disable opacity for non-active cells
                                        cursor: isActiveCell ? 'pointer' : 'not-allowed' // Change cursor based on cell state
                                    }} 
                                    onClick={() => isActiveCell && onCellClick(rowIndex, colIndex)} // Handle cell click only if active
                                >
                                    {isMarked && (
                                        <span style={{ 
                                            position: 'absolute', 
                                            top: '50%', 
                                            left: '50%', 
                                            transform: 'translate(-50%, -50%)', // Center the mark
                                            fontSize: '36px', // Increase font size for the mark
                                            color: '#ffffff' // Optional: Change color for better visibility
                                        }}>
                                            X
                                        </span>
                                    )} {/* Show 'X' if marked */}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;