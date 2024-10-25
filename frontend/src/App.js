import React from 'react';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage title='로그인' askChange='계정이 없으신가요?' changePage='회원가입 하기' page='/join'/>} />
        <Route path="/join" element={<JoinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
