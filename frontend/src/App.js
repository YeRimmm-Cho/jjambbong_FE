import React from "react";
import LoginPage from "./pages/LoginPage";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import ChatPage from "./pages/ChatPage";
import TamtamPage from "./pages/TamtamPage";
import MyPage from "./pages/MyPage";
import NewChat from "./pages/ChatPage"
import Kakaoauth from "./pages/Kakaoauth"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              title="로그인"
              askChange="계정이 없으신가요?"
              changePage="회원가입 하기"
              page="/join"
            />
          }
        />
        <Route path="/kakaoLogin" element={<KakaoLoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<TamtamPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/new" element={<NewChat/>} />
        <Route path="/kakaoauth" element={<Kakaoauth/>} />
      </Routes>
    </Router>
  );
}

export default App;
