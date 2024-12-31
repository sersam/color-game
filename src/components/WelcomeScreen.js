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
            <h1>Bienvenido a Music Bingo</h1>
            {step === 0 && (
                <div className="welcome-step">
                    <p>¡Prepárate para disfrutar y divertirte con este juego!</p>
                    <button onClick={handleNext}>Siguiente</button>
                </div>
            )}
            {step === 1 && (
                <div className="welcome-step">
                    <p>Canciones de forma aleatoria irán sonando y tendrás que acertar datos de ellas dependiendo de la categoría que te toque.</p>
                    <img src="/assets/random-category.gif" alt="Random Category" className="welcome-gif" />
                    <button onClick={handleNext}>Siguiente</button>
                </div>
            )}
            {step === 2 && (
                <div className="welcome-step">
                    <p>Cada jugador tendrá un tablero con colores que representarán las distintas categorías.</p>
                    <img src="/assets/game-board.png" alt="Random Category" className="welcome-gif" />
                    <button onClick={handleNext}>Siguiente</button>
                </div>
            )}
            {step === 3 && (
                <div className="welcome-step">
                    <p>Cuando hagas click en el botón de "Play" una cación empezará a sonar y una categoría se elegirá de forma aleatoria.</p>
                    <button onClick={handleNext}>Siguiente</button>
                </div>
            )}
            {step === 4 && (
                <div className="welcome-step">
                    <p>Si aciertas correctamente lo que pide la categoría, podrás marcar con una X una de las celdas del color de la categoría en tu tablero.</p>
                    <button onClick={handleNext}>Siguiente</button>
                </div>
            )}
            {step === 5 && (
                <div className="welcome-step">
                    <p>¡El primer jugador que haga linea gana!</p>
                    <button onClick={handleStart}>¡Empezar a jugar!</button>
                </div>
            )}
        </div>
    );
};

export default WelcomeScreen;