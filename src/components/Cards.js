import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from './Card';
import { Header } from './Header';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [previousCardState, setPreviousCardState] = useState(-1);
  const previousIndex = useRef(-1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [prevTimer, setPrevTimer] = useState(0);

  const handleLevelChange = (level) => {
    setDifficulty(level);
    const numberOfCards = getNumberOfCardsForDifficulty(level);
    generateCards(numberOfCards);
    setScore(0);
    setTimer(0);
    setPrevTimer(0); 
  };

  const getTimeLimitForDifficulty = (level) => {
    switch (level) {
      case 'easy':
        return 60; 
      case 'medium':
        return 90; 
      case 'hard':
        return 120; 
      default:
        return 60;
    }
  };

  const generateCards = async (numberOfCards) => {
    const response = await fetch(`https://picsum.photos/v2/list?page=1&limit=${numberOfCards}`);
    const data = await response.json();

    const generatedCards = [];
    for (let i = 0; i < numberOfCards; i++) {
      generatedCards.push({
        id: i,
        name: `Card ${i + 1}`,
        status: '',
        img: data[i].download_url,
      });

      generatedCards.push({
        id: i,
        name: `Card ${i + 1}`,
        status: '',
        img: data[i].download_url,
      });
    }
    setCards(generatedCards.sort(() => Math.random() - 0.5));
  };

  const getNumberOfCardsForDifficulty = (level) => {
    switch (level) {
      case 'easy':
        return 8;
      case 'medium':
        return 12;
      case 'hard':
        return 16;
      default:
        return 8;
    }
  };

  const matchCheck = (currentCard) => {
    if (cards[currentCard].id === cards[previousCardState].id) {
      cards[previousCardState].status = 'active matched';
      cards[currentCard].status = 'active matched';
      setPreviousCardState(-1);
      setScore(score + 1);
    } else {
      cards[currentCard].status = 'active';
      setCards([...cards]);
      setTimeout(() => {
        setPreviousCardState(-1);
        cards[currentCard].status = 'unmatch';
        cards[previousCardState].status = 'unmatch';
        setCards([...cards]);
      }, 1000);
    }
  };

  const clickhandler = (index) => {
    if (index !== previousIndex.current) {
      if (cards[index].status === 'active matched') {
        alert('Déjà trouvé !');
      } else {
        if (previousCardState === -1) {
          previousIndex.current = index;
          cards[index].status = 'active';
          setCards([...cards]);
          setPreviousCardState(index);
        } else {
          matchCheck(index);
          previousIndex.current = -1;
        }
      }
    } else {
      alert('Carte déjà sélectionnée');
    }
  };

  const handleRestart = useCallback(() => {
    const numberOfCards = getNumberOfCardsForDifficulty(difficulty);
    generateCards(numberOfCards);
    setScore(0);
    setTimer(0);
    setPreviousCardState(-1);
    previousIndex.current = -1;
    setPrevTimer(0); 
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer + 1 >= getTimeLimitForDifficulty(difficulty)) {
          handleRestart();
          return 0; 
        }
        return prevTimer + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [handleRestart, difficulty]);

  useEffect(() => {
    const numberOfCards = getNumberOfCardsForDifficulty(difficulty);
    generateCards(numberOfCards);
  }, [difficulty]); 

  return (
    <div className="container">
      <Header
        score={score}
        timer={timer}
        onLevelChange={handleLevelChange}
        onRestart={handleRestart}
      />
      <div className="cards-container">
        {cards.map((card, index) => (
          <Card key={index} card={card} index={index} clickhandler={clickhandler} />
        ))}
      </div>
    </div>
  );
}
