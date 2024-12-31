import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handleStart = () => {
        navigate('/spotify-auth');
    };

    return (
        <div className="welcome-container">
            <h1>Welcome to Music Bingo</h1>
            {step === 0 && (
                <div className="welcome-step">
                    <p>Get ready to enjoy a fun and interactive game!</p>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
            {step === 1 && (
                <div className="welcome-step">
                    <p>Random songs will be played, and you need to hit the correct category you are in.</p>
                    <img src="/assets/random-category.gif" alt="Random Category" className="welcome-gif" />
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
            {step === 2 && (
                <div className="welcome-step">
                    <p>Each player will have a board game with different colors representing categories.</p>
                    <img src="/assets/game-board.png" alt="Random Category" className="welcome-gif" />
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
            {step === 3 && (
                <div className="welcome-step">
                    <p>When you click the play button, a song will be played, and a category will be selected randomly.</p>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
            {step === 4 && (
                <div className="welcome-step">
                    <p>If you hit the correct category, you will mark it on your board.</p>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
            {step === 5 && (
                <div className="welcome-step">
                    <p>The first user to complete a line of hits on their board wins!</p>
                    <button onClick={handleStart}>Start</button>
                </div>
            )}
        </div>
    );
};

export default WelcomeScreen;