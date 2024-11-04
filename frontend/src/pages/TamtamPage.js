import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PlacePreview from "../components/TamtamPlacePreview";
import styles from "./TamtamPage.module.css";
import iconSend from "../assets/icon_send.png";
import iconGptProfile from "../assets/icon_gptprofile.png";

function TamtamPage() {
  const itinerary = 4; // 4박 5일 일정
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false); // 입력창 포커스 상태 관리
  const [messages, setMessages] = useState([]); // 채팅 메시지 상태

  const handleDetailsClick = () => {
    console.log("Show detailed itinerary");
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // 사용자 메시지 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      setMessage(""); // 전송 후 입력창 초기화

      // GPT 응답 더미 데이터 추가 (1초 후)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "GPT", text: "이것은 더미 응답입니다." },
        ]);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Shift + Enter로 줄바꿈, Enter로 전송
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
        <div className={styles.header}>
          <p className={styles.title}>탐탐이와 여행 계획하기</p>
        </div>

        {/* 채팅창 */}
        <div className={styles.chatWindow}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "GPT"
                  ? styles.gptMessageContainer
                  : styles.userMessageContainer
              }
            >
              {msg.sender === "GPT" && (
                <img
                  src={iconGptProfile}
                  alt="GPT Profile"
                  className={styles.gptProfileIcon}
                />
              )}
              <div
                className={
                  msg.sender === "user" ? styles.userBubble : styles.gptBubble
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 채팅 입력창 */}
        <div className={styles.chatInputContainer}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 보내기"
            className={`${styles.chatInput} ${isFocused ? styles.focused : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
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
