import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PlacePreview from "../components/TamtamPlacePreview";
import styles from "./TamtamPage.module.css";
import iconSend from "../assets/icon_send.png";

function TamtamPage() {
  const itinerary = 4; // 4박 5일 일정
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false); // 입력창 포커스 상태 관리

  const handleDetailsClick = () => {
    console.log("Show detailed itinerary");
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      console.log("Message sent:", message);
      setMessage(""); // 전송 후 입력창 초기화
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar>
        <PlacePreview
          itinerary={itinerary}
          onDetailsClick={handleDetailsClick}
        />
      </Sidebar>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.mainContent}>
        <p className={styles.title}>탐탐이와 여행 계획하기</p>

        {/* 채팅 입력창 */}
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 보내기"
            className={`${styles.chatInput} ${isFocused ? styles.focused : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <img
            src={iconSend}
            alt="send"
            className={styles.sendIcon}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default TamtamPage;
