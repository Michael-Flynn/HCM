import React, { useState } from 'react';
import axios from 'axios';

const CollectionManager = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json`);
      setCards(response.data);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }

  const addCardToCollection = card => {
    setCards([...cards, { ...card, inCollection: true }]);
  }

  const removeCardFromCollection = card => {
    setCards(cards.map(c => c.id === card.id ? { ...c, inCollection: false } : c));
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = event => {
    event.preventDefault();
    // TODO: search for cards
  }

  return (
    <div>
      <h1>My Collection</h1>
      {error && <p>An error occurred: {error.message}</p>}
      {isLoading ? (
        <p>Loading cards...</p>
      ) : (
        <>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for a card"
            />
            <button type="submit">Search</button>
          </form>
          <button onClick={fetchCards}>Show All Cards</button>
          <ul>
            {cards
              .filter(card => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(card => (
                <li key={card.id}>
                  {card.name}
                  {card.inCollection ? (
                    <button onClick={() => removeCardFromCollection(card)}>Remove from Collection</button>
                  ) : (
                    <button onClick={() => addCardToCollection(card)}>Add to Collection</button>
                  )}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CollectionManager;

