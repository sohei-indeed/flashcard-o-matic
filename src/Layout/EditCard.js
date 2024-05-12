import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { updateCard, readDeck } from "../utils/api";

function EditCard() {
  const [deckDetails, setDeckDetails] = useState({});
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const navigate = useNavigate();
  const { deckId, cardId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setDeckDetails(fetchedDeck);
        const card = fetchedDeck.cards.find(card => card.id === parseInt(cardId));
        setFront(card.front);
        setBack(card.back);
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
    const updatedCard = {
      front: front,
      back: back,
      id: cardId,
      deckId: parseInt(deckId)
    };

    try {
      const abortController = new AbortController();
      const savedCard = await updateCard(updatedCard, abortController.signal);
      setFront("");
      setBack("");
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error("Failed to update card", error);
    }
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
  };

  if (!deckDetails) {
    return <div>Loading...</div>; 
  }
  console.log(deckDetails)
  return (
    <div className="CreateDeck">
      <nav>
        <Link to="/">Home</Link> / <Link to={`/decks/${deckId}`}>{deckDetails.name}</Link> / Edit Card {cardId}
      </nav>
      <h2>Edit Card</h2>
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
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditCard;
