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
    await onSave(parseInt(deckId), { front, back, id: card.id });
    if (!isEdit) {
        setFront('');
        setBack('');
        navigate(`/decks/${deckId}`);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="front">Front</label>
        <textarea
          className="form-control"
          id="front"
          value={front}
          onChange={handleFrontChange}
          placeholder="Front side of card"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="back">Back</label>
        <textarea
          className="form-control"
          id="back"
          value={back}
          onChange={handleBackChange}
          placeholder="Back side of card"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mr-2">{isEdit ? 'Submit' : 'Save'}</button>
      <button type="button" className="btn btn-secondary" onClick={handleCancel}>{isEdit ? 'Cancel' : 'Done'}</button>
    </form>
  );
}

export default CardForm;