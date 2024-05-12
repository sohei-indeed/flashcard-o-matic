import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { readDeck } from "../utils/api";

function Study() {
  const { deckId } = useParams();
  const [studyDeck, setStudyDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setStudyDeck(fetchedDeck);
      } catch (error) {
        console.error("Error fetching deck details", error);
      }
    }

    fetchDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId]);


  if (!studyDeck || !studyDeck.cards ) {
    return <p>Loading...</p>; 
  }

  const content = () => {
    if (!studyDeck.cards || studyDeck.cards.length === 0) {
      return (
        <div>
          <h3>Not enough cards.</h3>
          <p>No cards available. Please add some cards.</p>;
          <Link to={`/decks/${deckId}/cards/new`}>Add Cards</Link>
        </div>
        );
    }

    if (studyDeck.cards.length <= 2) {
      return (
      <div>
        <h3>Not enough cards.</h3>
        <p>You need at least 3 cards to study. There are {studyDeck.cards.length} cards in this deck.</p>
        <Link to={`/decks/${deckId}/cards/new`}>Add Cards</Link>
      </div>
      );
    }

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
      if (currentCard < studyDeck.cards.length - 1) {
        setCurrentCard(currentCard + 1);
        setIsFlipped(false);
      } else {
        if (window.confirm("Restart cards?")) {
          setCurrentCard(0);
          setIsFlipped(false);
        } else {
          navigate("/");
        }
      }
    };

    return (
      <div>
        <h3>Card {currentCard + 1} of {studyDeck.cards.length}</h3>
        <p>{isFlipped ? studyDeck.cards[currentCard].back : studyDeck.cards[currentCard].front}</p>
        <button onClick={handleFlip}>{isFlipped ? "Flip back" : "Flip"}</button>
        {isFlipped && (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    );
  };

  return (
    <div className="Study">
      <nav>
        <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{studyDeck.name}</Link> / Study
      </nav>
      <h2>{studyDeck.name}: Study</h2>
      {content()}
    </div>
  );
}

export default Study;
