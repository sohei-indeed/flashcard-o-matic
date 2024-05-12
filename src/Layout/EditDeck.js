import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { updateDeck, readDeck } from "../utils/api";

function EditDeck() {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const { deckId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchDeck() {
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setDeckName(fetchedDeck.name);
        setDeckDescription(fetchedDeck.description);
      } catch (error) {
        console.error("Error fetching deck details", error);
      }
    }
    fetchDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  const handleNameChange = (event) => {
    setDeckName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDeckDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newDeck = {
      id: deckId,
      name: deckName,
      description: deckDescription,
    };

    try {
      const savedDeck = await updateDeck(newDeck);
      navigate(`/decks/${savedDeck.id}`);
    } catch (error) {
      console.error("Failed to create deck", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="UpdateDeck">
      <nav>
        <Link to="/">Home</Link> / <Link to={`/decks/${deckId}/edit`}>{deckName}</Link> / Edit Deck
      </nav>
      <h2>Edit Deck</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="deckName">Deck Name</label>
          <input
            id="deckName"
            type="text"
            value={deckName}
            onChange={handleNameChange}
            placeholder="Deck Name"
            required
          />
        </div>
        <div>
          <label htmlFor="deckDescription">Description</label>
          <textarea
            id="deckDescription"
            value={deckDescription}
            onChange={handleDescriptionChange}
            placeholder="Brief description of the deck"
            required
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditDeck;
