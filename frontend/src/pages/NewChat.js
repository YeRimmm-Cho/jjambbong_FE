import React, { useState, useRef, useEffect } from "react";
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

function NewChat() {
  const itinerary = 4;
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // 수정 불가능 상태 추가

  const navigate = useNavigate();
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  const mockUserData = {
    profileImage: iconUserProfile,
    nickname: "여행이 가고 싶은 예림",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConfirm = () => {
    const requestData = {
      travel_date: `${dateRange[0].toLocaleDateString()} ~ ${dateRange[1].toLocaleDateString()}`, // 날짜 범위
      travel_days: Math.ceil(
        (dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24)
      ), // 여행 일수 계산
      travel_mate: selectedCompanion, // 동반자
      travel_theme: selectedThemes.join(", "), // 테마
    };

    const ngrokUrl = "백엔드 파이썬 URL"; // 스프링 백엔드 URL

    axios
      .post(`${ngrokUrl}/plan`, requestData)
      .then((response) => {
        console.log("백엔드 응답:", response.data);
        alert("백엔드로 데이터가 성공적으로 전송되었습니다!");
        addMessage(
          response.data.response + response.data.follow_up ||
            "일정 추천을 시작합니다.",
          false
        );
      })
      .catch((error) => {
        console.error("백엔드 요청 오류:", error);
        alert("데이터 전송에 실패했습니다.");
      });
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
        const response = await axios.post(
          "http://abcd1234.ngrok.io/api/endpoint",
          {
            prompt: message, // GPT 모델로 전달할 프롬프트
          }
        );

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
    setIsGenerating(false);
    setIsLocked(false); // 초기화 시 잠금 해제
  };

  const handleConfirm = async () => {
    if (!dateRange[0] || !selectedCompanion || selectedThemes.length === 0) {
      alert("모든 정보를 입력해주세요!");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post("백엔드 API 실제 주소", {
        dateRange: {
          start: dateRange[0].toISOString(),
          end: dateRange[1]?.toISOString() || dateRange[0].toISOString(),
        },
        companion: selectedCompanion,
        themes: selectedThemes,
      });
      
      console.log("백엔드 응답:", response.data);
      setIsLocked(true); // 일정 생성 후 잠금
      alert("일정 생성이 완료되었습니다!");
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert("백엔드로 데이터를 전송하는 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isDateRangeSelected = dateRange[0] && dateRange[1];

  return (
    <div className={styles.container}>
      <Sidebar>
        <PlacePreview itinerary={itinerary} />
      </Sidebar>

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
          <div className={styles.profileContainer} onClick={() => navigate("/mypage")}>
            <img
              src={mockUserData.profileImage}
              alt="User Profile"
              className={styles.profileImage}
            />
            <span className={styles.profileName}>{mockUserData.nickname}</span>
          </div>
        </div>

        <div className={styles.chatWindow} ref={chatWindowRef}>
          <div className={styles.questionStyle}>
            <div className={styles.calendarStyle}>
              <Calendar
                dateRange={dateRange}
                onChange={setDateRange}
                disabled={isLocked} // 수정 불가능 상태 적용
              />
              <span className={styles.gptBubble}>언제 여행을 떠나시나요?</span>
            </div>
            <span className={styles.userBubble}>
              {dateRange[0] ? dateRange[0].toLocaleDateString() : null}
              {dateRange[1] && dateRange[0] !== dateRange[1]
                ? ` ~ ${dateRange[1].toLocaleDateString()}`
                : ""}
            </span>
          </div>
          <div></div>

          {isDateRangeSelected && (
            <div className={styles.questionStyle}>
              <div>
                <span className={styles.gptBubble}>
                  누구와 함께 여행을 떠나시나요?
                </span>
                <WithWhom
                  onCompanionSelect={setSelectedCompanion}
                  disabled={isLocked} // 수정 불가능 상태 적용
                />
              </div>
              {selectedCompanion && (
                <span className={styles.userBubble}>{selectedCompanion}</span>
              )}
            </div>
          )}

          {selectedCompanion && (
            <div className={styles.questionStyle}>
              <div>
                <span className={styles.gptBubble}>
                  여행의 테마를 골라주세요! (다중 선택 가능)
                </span>
                <Thema
                  onSelectionChange={(themes) => {
                    setSelectedThemes(themes);
                  }}
                />
              </div>

              {/* 선택한 테마 표시 */}
              <div className={styles.bubbleContainer}>
                {selectedThemes.map((theme, index) => (
                  <span key={index} className={styles.bubble}>
                    #{theme}
                  </span>
                ))}
              </div>
            </div>
          )}


          {/* 테마 선택 이후에 확정 버튼 표시 */}
          {selectedThemes.length > 0 && (
            <div className={styles.leftButtonContainer}>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                이 정보를 바탕으로 탐탐이에게 일정 추천받기
              </button>
            </div>
          )}

          <div>
            {isGenerating && (
              <div className={styles.gptBubble}>
                여행 일정을 생성중입니다...
              </div>
            )}
          </div>

          {/* 기존 채팅 메시지 */}
          {selectedThemes.length > 0 && !isLocked && (
            <button className={styles.confirm} onClick={handleConfirm}>
              일정 생성
            </button>
          )}

          {isGenerating && (
            <div className={styles.gptBubble}>
              여행 일정을 생성중입니다...
            </div>
          )}

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
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInputContainer}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지 보내기"
            className={`${styles.chatInput} ${isFocused ? styles.focused : ""}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Enter 시 기본 동작 차단
                handleSendMessage(); // 메시지 전송

              }
            }}
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

export default NewChat;
