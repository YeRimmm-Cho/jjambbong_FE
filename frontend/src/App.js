import React from "react";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import ChatPage from "./pages/ChatPage";
import TamtamPage from "./pages/TamtamPage";
import MyPage from "./pages/MyPage";
import NewChat from "./pages/NewChat";
import RedirectPage from "./pages/RedirectPage";
import TestPage from "./pages/TestPage";
import DetailedItineraryPage from "./pages/DetailedItineraryPage";
import Main from "./pages/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/kakaoLogin" element={<KakaoLoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<TamtamPage />} />
        <Route path="/detailed-itinerary" element={<DetailedItineraryPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/new" element={<NewChat />} />
        <Route path="/RedirectPage" element={<RedirectPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
