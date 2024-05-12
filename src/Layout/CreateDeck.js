import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createDeck } from "../utils/api";

function CreateDeck() {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setDeckName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDeckDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newDeck = {
      name: deckName,
      description: deckDescription,
    };

    try {
      const savedDeck = await createDeck(newDeck);
      navigate(`/decks/${savedDeck.id}`);
    } catch (error) {
      console.error("Failed to create deck", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="CreateDeck">
      <nav>
        <Link to="/">Home</Link> / Create Deck
      </nav>
      <h2>Create Deck</h2>
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

export default CreateDeck;
