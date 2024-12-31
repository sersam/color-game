import React from 'react';
import './GameBoard.css';

const GameBoard = ({ board, markedCells, onCellClick, activeColor }) => {
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
                                    className={`cell ${isMarked ? 'marked' : ''}`} 
                                    style={{ 
                                        backgroundColor: cell, 
                                        position: 'relative', 
                                        opacity: !isActiveCell ? 0.6 : 1, 
                                        cursor: isActiveCell ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }} 
                                    onClick={() => isActiveCell && onCellClick(rowIndex, colIndex)} // Handle cell click only if active
                                >
                                    {isMarked && (
                                        <span className="mark">
                                            ✓
                                        </span>
                                    )}
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