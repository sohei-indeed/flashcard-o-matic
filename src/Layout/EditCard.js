import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CardForm from './CardForm';
import { updateCard, readDeck } from '../utils/api';

function EditCard() {
  const [deckDetails, setDeckDetails] = useState({});
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        const card = fetchedDeck.cards.find(card => card.id === parseInt(cardId));
        setDeckDetails({ ...fetchedDeck, card });
      } catch (error) {
        console.error("Error fetching deck details", error);
      }
    }
    fetchDeck();
    return () => abortController.abort();
  }, [deckId, cardId]);

  const saveCard = async (deckId, card) => {
    const abortController = new AbortController();
    await updateCard({ ...card, deckId }, abortController.signal);
    navigate(`/decks/${deckId}`);
  };

  const cancel = () => {
    navigate(`/decks/${deckId}`);
  };

  if (!deckDetails.card) {
    return <div>Loading...</div>;
  }

  return (
<div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckDetails.name}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Edit Card {cardId}</li>
        </ol>
      </nav>
      <h2>Edit Card</h2>
      <CardForm deckId={deckId} card={deckDetails.card} onSave={saveCard} onCancel={cancel} isEdit={true} />
    </div>
  );
}

export default EditCard;