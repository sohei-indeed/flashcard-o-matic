import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";

function DeckListView({ deck, onDeleteDeck }) {
  const [deckDetails, setDeckDetails] = useState(deck);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deck.id, abortController.signal);
        setDeckDetails(fetchedDeck);
      } catch (error) {
        console.error("Error fetching deck details", error);
      }
    }
    console.log(deckDetails)
    if (!deckDetails) { 
      fetchDeck();
    }

    return () => {
      abortController.abort();
    };
  }, [deck]);

  return (
    <div className="DeckListView">
      <h2>{deck.name}</h2>
      <p>{deckDetails.cards.length} cards</p>
      <p>{deck.description}</p>
      <Link to={`/decks/${deck.id}`}>View</Link>
      <Link to={`/decks/${deck.id}/study`}>Study</Link>
      <button onClick={() => onDeleteDeck(deck.id)}>Delete</button>
    </div>
  );
}

export default DeckListView;
