import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";

function DeckDetails() {
  const [deckDetails, setDeckDetails] = useState(null);
  const { deckId } = useParams();
  const navigate = useNavigate();

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

  const handleDeleteDeck = async (deckId) => {
    const abortController = new AbortController();
    try {
      if (window.confirm("Delete this deck?\n\nYou will not be able to recover it.")) {
        await deleteDeck(deckId, abortController.signal);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    const abortController = new AbortController();
    try {
      if (window.confirm("Delete this card?\n\nYou will not be able to recover it.")) {
        await deleteCard(cardId, abortController.signal);
        setDeckDetails(prevDetails => ({
          ...prevDetails,
          cards: prevDetails.cards.filter(card => card.id !== cardId)
        }));
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };


  if (!deckDetails || !deckDetails.cards) {
    return <p>Loading...</p>;
  }

  return (
    <div className="DeckDetails">
      <nav>
        <Link to="/">Home</Link> / {deckDetails.name}
      </nav>
      <h2>{deckDetails.name}</h2>
      <p>{deckDetails.description}</p>
      <Link to={`/decks/${deckId}/edit`}>Edit</Link>
      <Link to={`/decks/${deckId}/study`}>Study</Link>
      <Link to={`/decks/${deckId}/cards/new`}>Add Cards</Link>
      <button onClick={() => handleDeleteDeck(deckId)}>Delete</button>
      <h3>Cards</h3>
      {deckDetails.cards.map((card) => (
        <div key={card.id}>
          <p>{card.front}</p>
          <p>{card.back}</p>
          <Link to={`/decks/${deckId}/cards/${card.id}/edit`}>Edit</Link>
          <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default DeckDetails;
