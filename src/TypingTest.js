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
  const [difficulty, setDifficulty] = useState('Medium');

  const difficultyLevels = {
    Easy: {
      sentences: [
        'This is an easy sentence for typing practice.',
        'Typing is fun and easy when you practice rgit egularly.',
      ],
      time: 30,
    },
    Medium: {
      sentences: [
        'Medium-level @ sentences are % a good challenge > for typing practice.',
        'Typing accurately + and quickly O takes practice & and dedication.',
      ],
      time: 20,
    },
    Hard: {
      sentences: [
        '(Hard senten!ces test *your t-yping skil[ls to the limit.',
        'Improving%% you#r typing spe^ed is a rew@arding exp()erience.',
      ],
      time: 10,
    },
  };

  useEffect(() => {
    generateSentence();
    setRemainingTime(difficultyLevels[difficulty].time);
  }, [difficulty]);

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
    const sentences = difficultyLevels[difficulty].sentences;
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
    setRemainingTime(difficultyLevels[difficulty].time);
  };

  return (
    <div className="typing-test-container">
      <h1>Welcome to the Typer Zone</h1>
      <p className="note">
        <strong>Note:</strong> Your accuracy and typing speed will be displayed at the end of the test.
      </p>
      {/* <p className="timer">
        <strong>Timer:</strong> {remainingTime} seconds
      </p> */}
      <div className="difficulty-selector">
        <label>Difficulty Level: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {Object.keys(difficultyLevels).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
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
        </div>
      )}
    </div>
  );
};

export default TypingTest;
