import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PlacePreview from "../components/TamtamPlacePreview";
import Calendar from "../components/Calendar";
import WithWhom from "../components/WithWhom";
import Thema from "../components/Thema";
import styles from "./NewChat.module.css";
import iconSend from "../assets/icon_send.png";
import iconGptProfile from "../assets/icon_gptprofile.png";
import iconUserProfile from "../assets/icon_userprofile.png";
import iconClear from "../assets/icon_clear.png";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function newChat() {
  const itinerary = 4;
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const navigate = useNavigate();

  const mockUserData = {
    profileImage: iconUserProfile,
    nickname: "여행이 가고 싶은 예림",
  };

  const addMessage = (text, isUser) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), sender: isUser ? "user" : "GPT", text },
    ]);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      addMessage(message, true);
      setMessage("");

      try {
        const response = await axios.post("백엔드 API 실제 주소", {
          prompt: message,
        });

        if (response.data) {
          addMessage(response.data.responseText || "응답이 없습니다.", false);
        }
      } catch (error) {
        console.error("Error fetching GPT response:", error);
        addMessage("Error: 응답을 가져올 수 없습니다.", false);
      }
    }
  };

  const handleReset = () => {
    setMessages([]);
    setDateRange([null, null]);
    setSelectedCompanion(null);
    setSelectedThemes([]);
  };

  const handleProfileClick = () => {
    navigate("/mypage");
  };

  const handleCompanionSelect = (companion) => {
    setSelectedCompanion(companion);
  };

  const handleThemeSelectionChange = (themes) => {
    setSelectedThemes(themes);
  };

  const isDateRangeSelected = dateRange[0] && dateRange[1];

  return (
    <div className={styles.container}>
      {/* Sidebar 영역 */}
      <Sidebar>
        <PlacePreview itinerary={itinerary} />
      </Sidebar>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <p className={styles.title}>탐탐이와 여행 계획하기</p>
            <img
              src={iconClear}
              alt="초기화"
              className={styles.resetButton}
              onClick={handleReset}
              title="대화 초기화"
            />
          </div>
          <div className={styles.profileContainer} onClick={handleProfileClick}>
            <img
              src={mockUserData.profileImage}
              alt="User Profile"
              className={styles.profileImage}
            />
            <span className={styles.profileName}>{mockUserData.nickname}</span>
          </div>
        </div>

        {/* Chat Window */}
        <div className={styles.chatWindow}>
          {/* 날짜 선택 */}
          <div className={styles.questionStyle}>
            <div className={styles.calendarStyle}>
              <Calendar dateRange={dateRange} onChange={setDateRange} />
              <span className={styles.llmMessage}>언제 여행을 떠나시나요?</span>
            </div>
            <span className={styles.clientMessage}>
              {dateRange[0]
                ? dateRange[0].toLocaleDateString()
                : null}
              {dateRange[1] && dateRange[0] !== dateRange[1]
                ? ` ~ ${dateRange[1].toLocaleDateString()}`
                : ""}
            </span>
          </div>

          {/* 동반자 선택 */}
          {isDateRangeSelected && (
            <div className={styles.questionStyle}>
              <div>
                <span className={styles.llmMessage}>
                  누구와 함께 여행을 떠나시나요?
                </span>
                <WithWhom onCompanionSelect={handleCompanionSelect} />
              </div>
              {selectedCompanion && (
                <span className={styles.clientMessage}>
                  {selectedCompanion}
                </span>
              )}
            </div>
          )}

          {/* 테마 선택 */}
          {selectedCompanion && (
            <div className={styles.questionStyle}>
              <div>
                <span className={styles.llmMessage}>
                  여행의 테마를 골라주세요! (다중 선택 가능)
                </span>
                <Thema onSelectionChange={handleThemeSelectionChange} />
              </div>
              <div className={styles.bubbleContainer}>
                {selectedThemes.map((theme, index) => (
                  <span key={index} className={styles.bubble}>
                    #{theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 기존 채팅 메시지 */}
          {messages.map((msg) => (
            <div
              key={msg.id}
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

        {/* 메시지 입력창 */}
        <div className={styles.chatInputContainer}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

export default newChat;