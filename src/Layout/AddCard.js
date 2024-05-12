import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createCard, readDeck } from "../utils/api";

function AddCard() {
  const [deckDetails, setDeckDetails] = useState({});
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const navigate = useNavigate();
  const { deckId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setDeckDetails(fetchedDeck);
      } catch (error) {
        console.error("Error fetching deck details", error);
      }
    }
    fetchDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  const handleFrontChange = (event) => {
    setFront(event.target.value);
  };

  const handleBackChange = (event) => {
    setBack(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newCard = {
      front: front,
      back: back,
      deckId: deckId
    };

    try {
      const abortController = new AbortController();
      const savedCard = await createCard(deckId, newCard, abortController.signal);
      setFront("");
      setBack("");
    } catch (error) {
      console.error("Failed to create card", error);
    }
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
  };

  if (!deckDetails) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="CreateDeck">
      <nav>
        <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{deckDetails.name}</Link> / Add Card
      </nav>
      <h2>Add Card</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="front">Front</label>
          <textarea
            id="front"
            type="text"
            value={front}
            onChange={handleFrontChange}
            placeholder="Front side of card"
            required
          />
        </div>
        <div>
          <label htmlFor="back">Back</label>
          <textarea
            id="back"
            value={back}
            onChange={handleBackChange}
            placeholder="Back side of card"
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Done</button>
      </form>
    </div>
  );
}

export default AddCard;
