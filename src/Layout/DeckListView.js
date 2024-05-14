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
<div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{deck.name}</h5>
        <p className="card-text">{deck.description}</p>
        <p className="card-text"><small className="text-muted">{deck.cards.length} cards</small></p>
        <div className="d-flex justify-content-between">
          <div>
            <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">View</Link>
            <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">Study</Link>
            <Link to={`/decks/${deck.id}/edit`} className="btn btn-secondary mr-2">Edit</Link>
          </div>
          <button onClick={() => onDeleteDeck(deck.id)} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeckListView;
