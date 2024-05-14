import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckListView from "./DeckListView";
import { listDecks, deleteDeck } from "../utils/api";

function DeckList() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
  
    async function fetchDecks() {
      try {
        const loadedDecks = await listDecks(abortController.signal);
        setDecks(loadedDecks);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    }
  
    fetchDecks();
  
    return () => {
      abortController.abort();
    };
  }, []);

  const handleDeleteDeck = async (deckId) => {
    const abortController = new AbortController();
    try {
      if (window.confirm("Delete this deck?\n\nYou will not be able to recover it.")) {
        await deleteDeck(deckId, abortController.signal);
        setDecks(decks.filter(deck => deck.id !== deckId)); 
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Decks</h2>
        <Link to="/decks/new" className="btn btn-primary">Create Deck</Link>
      </div>
      {decks.length > 0 ? (
        decks.map((deck) => (
          <DeckListView key={deck.id} deck={deck} onDeleteDeck={handleDeleteDeck}/>
        ))
      ) : (
        <p>No decks available. Please create one.</p>
      )}
    </div>
  );
}

export default DeckList;
