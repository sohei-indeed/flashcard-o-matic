import React from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeckList from "./DeckList";
import Study from "./Study";
import CreateDeck from "./CreateDeck";
import DeckDetails from "./DeckDetails";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";

function Layout() {
  return (
    <>
      <Header />
      <div className="container"> 
        <Routes>
          <Route path="/" element={<DeckList />} />
          <Route path="/decks/:deckId/study" element={<Study />} />
          <Route path="/decks/new" element={<CreateDeck />} />
          <Route path="/decks/:deckId" element={<DeckDetails />} />
          <Route path="/decks/:deckId/edit" element={<EditDeck />} />
          <Route path="/decks/:deckId/cards/new" element={<AddCard />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
          <Route path="*" element={<NotFound />} />  
        </Routes>
      </div>
    
    
    
    </>
          
  );
}

export default Layout;
