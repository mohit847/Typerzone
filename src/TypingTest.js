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
  const [remainingTime, setRemainingTime] = useState(60); 

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
      'The sun sets behind the mountains, painting the sky in shades of pink and orange. Birds chirp their evening melodies, bidding farewell to another day.',
      'In the bustling city streets, people rush by, their footsteps echoing on the pavement. Neon lights illuminate the night, creating a vibrant tapestry of colors.',
      'A gentle breeze rustles through the trees, carrying the scent of freshly bloomed flowers. The tranquil lake reflects the moonlight, casting a mesmerizing glow.',
      'Lost in a world of words, I immerse myself in stories that transport me to distant lands. Each page turned unveils a new adventure, a new realm to explore.',
      'The aroma of freshly brewed coffee fills the air, awakening my senses. With each sip, warmth spreads through my body, energizing me for the ahead.',
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
    setRemainingTime(60);
  };

  return (
    <div className="typing-test-container">
      <h1>Welcome to the Typer Zone</h1>
      <p className="note">
      <strong>Note:</strong> Your accuracy and typing speed will be displayed at the end of the test.
    </p>
    <p className="timer">
      <strong>Timer:</strong> The 1-minute timer will start once you begin typing.
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
