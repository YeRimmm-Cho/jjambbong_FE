import React from "react";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import ChatPage from "./pages/ChatPage";
import TamtamPage from "./pages/TamtamPage";
import MyPage from "./pages/MyPage";
import NewChat from "./pages/NewChat"
import Kakaoauth from "./pages/Kakaoauth"
import TestPage from "./pages/TestPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/kakaoLogin" element={<KakaoLoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<TamtamPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/new" element={<NewChat/>} />
        <Route path="/kakaoauth" element={<Kakaoauth/>} />
        <Route path="/test" element={<TestPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
