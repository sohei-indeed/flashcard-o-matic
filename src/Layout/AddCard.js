import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CardForm from './CardForm';
import { createCard, readDeck } from '../utils/api';

function AddCard() {
  const [deckDetails, setDeckDetails] = useState({});
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
    return () => abortController.abort();
  }, [deckId]);

  const saveCard = async (deckId, card) => {
    const abortController = new AbortController();
    await createCard(deckId, card, abortController.signal);
  };

  const cancel = () => {
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
      <CardForm deckId={deckId} onSave={saveCard} onCancel={cancel} isEdit={false} />
    </div>
  );
}

export default AddCard;