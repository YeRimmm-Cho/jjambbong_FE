import React from "react";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import TamtamPage from "./pages/TamtamPage";
import MyPage from "./pages/MyPage";
import NewChat from "./pages/NewChat";
import RedirectPage from "./pages/RedirectPage";
import TestPage from "./pages/TestPage";
import DetailedItineraryPage from "./pages/DetailedItineraryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Main from "./pages/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/kakaoLogin" element={<KakaoLoginPage />} />
        <Route path="/detailed-itinerary" element={<DetailedItineraryPage />} />
        <Route
          path="/detailed-itinerary/:id"
          element={<DetailedItineraryPage />}
        />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/new" element={<NewChat />} />
        <Route path="/oauth2/authorization/kakao" element={<RedirectPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/*" element={<Main />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
