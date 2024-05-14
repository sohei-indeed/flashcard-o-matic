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
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{deckDetails.name}</li>
        </ol>
      </nav>
      <h2>{deckDetails.name}</h2>
      <p>{deckDetails.description}</p>
      <div className="mb-3">
        <Link to={`/decks/${deckId}/edit`} className="btn btn-secondary mr-2">Edit</Link>
        <Link to={`/decks/${deckId}/study`} className="btn btn-primary mr-2">Study</Link>
        <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">Add Cards</Link>
        <button onClick={() => handleDeleteDeck(deckId)} className="btn btn-danger ml-2">Delete</button>
      </div>
      <h3>Cards</h3>
      {deckDetails.cards.map((card) => (
        <div key={card.id} className="card mb-2">
          <div className="card-body">
            <p className="card-text"><strong>Front:</strong> {card.front}</p>
            <p className="card-text"><strong>Back:</strong> {card.back}</p>
            <Link to={`/decks/${deckId}/cards/${card.id}/edit`} className="btn btn-secondary mr-2">Edit</Link>
            <button onClick={() => handleDeleteCard(card.id)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeckDetails;
