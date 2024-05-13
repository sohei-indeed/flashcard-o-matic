import React from 'react';
import { useNavigate } from 'react-router-dom';

function CardForm({ deckId, card = { front: '', back: '' }, onSave, onCancel, isEdit }) {
  const navigate = useNavigate();

  const [front, setFront] = React.useState(card.front);
  const [back, setBack] = React.useState(card.back);

  const handleFrontChange = event => setFront(event.target.value);
  const handleBackChange = event => setBack(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(deckId, { front, back, id: card.id });
    setFront('');
    setBack('');
    if (!isEdit) navigate(`/decks/${deckId}`);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="front">Front</label>
        <textarea
          id="front"
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
      <button type="submit">{isEdit ? 'Submit' : 'Save'}</button>
      <button type="button" onClick={handleCancel}>{isEdit ? 'Cancel' : 'Done'}</button>
    </form>
  );
}

export default CardForm;