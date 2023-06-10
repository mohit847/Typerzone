import React, { useState, useEffect } from 'react';
import './TypingTest.css';

const TypingTest = () => {
  const [sentence, setSentence] = useState('');
  const [input, setInput] = useState('');
  const [incorrectIndexes, setIncorrectIndexes] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); 

  useEffect(() => {
    generateSentence();
  }, []);

  useEffect(() => {
    let timer;
    if (startTime && !isCompleted && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && !isCompleted) {
      handleTypingCompleted();
    }

    return () => clearTimeout(timer);
  }, [startTime, isCompleted, remainingTime]);

  const generateSentence = () => {
    const sentences = [
      'As the radiant sun gracefully dips below the horizon, a breathtaking spectacle unfolds before our eyes. The sky transforms into a vivid tapestry of fiery oranges, soothing purples, and gentle pinks, casting a spellbinding aura. Melodic tunes of birds serenade the fading light, bidding adieu to another day filled with life and beauty.',
      'In the heart of the bustling city, a symphony of movement and sounds engulfs the streets. People hurriedly traverse through the vibrant urban landscape, their footsteps echoing in harmony with the rhythm of the city. A dazzling array of neon lights adorns the buildings, illuminating the night with a kaleidoscope of vibrant colors, painting the city in an enchanting aura.',
      'A gentle zephyr dances through the emerald leaves, carrying the fragrance of blossoming flowers on its wings. The tranquil lake mirrors the shimmering moonlight, creating a celestial reflection that enchants all who behold it. Nature\'s orchestra performs a melodious symphony, where rustling leaves, chirping crickets, and the soothing babble of a nearby brook compose a harmonious serenade that soothes the soul.',
      'Lost within the boundless realms of literature, imagination takes flight with every turned page. Words come alive, weaving intricate tales that transport readers to distant lands and fantastical worlds. With each chapter, reality fades into the background as the mind becomes enraptured by captivating narratives and compelling characters. Through the power of storytelling, ordinary moments become extraordinary adventures, and dreams take shape within the fertile soil of imagination.',
      'Awakening to the tantalizing aroma of freshly brewed coffee, the senses are invigorated and the world comes alive. Each sip carries the warmth and richness that fuels inspiration and ignites creativity. With every cup, a journey of flavors unfolds, awakening the taste buds and tantalizing the palate. The velvety texture, the nuanced flavors, and the comforting embrace of this beloved beverage create moments of solace and delight, infusing the day with a renewed sense of energy and purpose.',
    ];
    

    const randomIndex = Math.floor(Math.random() * sentences.length);
    const randomSentence = sentences[randomIndex];
    setSentence(randomSentence);
  };

  const handleInputChange = (e) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const inputValue = e.target.value;
    setInput(inputValue);

    let incorrectIndexes = [];
    let i = 0;

    while (i < inputValue.length && i < sentence.length) {
      if (inputValue[i] !== sentence[i]) {
        incorrectIndexes.push(i);
      }
      i++;
    }

    setIncorrectIndexes(incorrectIndexes);

    if (inputValue === sentence) {
      handleTypingCompleted();
    }
  };

  const handleTypingCompleted = () => {
    setEndTime(Date.now());
    setIsCompleted(true);
    calculateAccuracy();
  };

  const calculateAccuracy = () => {
    const correctChars = input.split('').filter((char, index) => char === sentence[index]);
    const accuracyValue = Math.floor((correctChars.length / input.length) * 100);
    setAccuracy(accuracyValue);
  };

  const calculateTypingSpeed = () => {
    if (startTime) {
      const timeInSeconds = (endTime - startTime) / 1000;
      const typedWords = input.trim().split(' ').length;
      const typingSpeed = Math.round((typedWords / timeInSeconds) * 60);

      return typingSpeed;
    }

    return 0;
  };

  const restartTest = () => {
    generateSentence();
    setInput('');
    setIncorrectIndexes([]);
    setAccuracy(0);
    setStartTime(0);
    setEndTime(0);
    setIsCompleted(false);
    setRemainingTime(300);
  };

  return (
    <div className="typing-test-container">
      <h1>Welcome to the Typer Zone</h1>
      <p className="note">
      <strong>Note:</strong> Your accuracy and typing speed will be displayed at the end of the test.
    </p>
    <p className="timer">
      <strong>Timer:</strong> The 5-minute timer will start once you begin typing.
    </p>
      <p className="sentence">
        {sentence.split('').map((char, index) => {
          let charClass = '';

          if (index < input.length) {
            if (char === input[index]) {
              charClass = 'correct';
            } else {
              charClass = 'incorrect';
            }
          } else if (index === input.length) {
            charClass = 'next';
          }

          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </p>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing..."
        disabled={isCompleted}
      />
      {isCompleted ? (
        <div className="results">
          <p>Typing speed: {calculateTypingSpeed()} wpm</p>
          <p>Accuracy: {accuracy}%</p>
          <button onClick={restartTest}>Restart Test</button>
        </div>
      ) : (
        <div className="results">
          <p>Time remaining: {remainingTime} seconds</p>
          {remainingTime === 0 && (
            <div>
              <p>Typing speed: {calculateTypingSpeed()} words per minute</p>
              <p>Accuracy: {accuracy}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypingTest;
