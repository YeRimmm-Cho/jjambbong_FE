import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TamtamPage from "./pages/TamtamPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TamtamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
