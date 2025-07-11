import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NewsProvider } from "./context/NewsContext";
import Home from "./pages/Home";
import "./App.css";

const App: React.FC = () => (
  <NewsProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </NewsProvider>
);

export default App;
