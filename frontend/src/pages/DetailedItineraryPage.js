import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SidebarTabs from "../components/SidebarTabs";
import TravelSummary from "../components/TravelSummary";
import DetailedSchedule from "../components/DetailedSchedule";
import Route from "../components/Route";
import Checklist from "../components/Checklist";
import Modal from "../components/Modal";
import styles from "./DetailedItineraryPage.module.css";
import axios from "axios";

function DetailedItineraryPage() {
  const [activeTab, setActiveTab] = useState("여행 요약");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 3)),
  ]);
  const [selectedThemes, setSelectedThemes] = useState(["자연", "휴양"]);
  const navigate = useNavigate();

  const tabs = [
    { label: "여행 요약", content: <TravelSummary /> },
    { label: "상세 일정", content: <DetailedSchedule /> },
    { label: "길찾기", content: <Route /> },
    { label: "체크리스트", content: <Checklist /> },
  ];

  // 모달 열기
  const handleConfirmClick = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 (X 버튼용)
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 일정 확정 (확인 버튼용)
  const handleConfirm = async () => {
    setIsModalOpen(false); // 모달 닫기

    // 카드 형식으로 저장할 일정 데이터
    const itineraryData = {
      title: `여행 일정 - ${dateRange[0].toLocaleDateString()} ~ ${dateRange[1].toLocaleDateString()}`,
      imageUrl: "https://example.com/your-image.jpg", // 이미지 URL
      date: `${dateRange[0].toLocaleDateString()} ~ ${dateRange[1].toLocaleDateString()}`,
      tags: selectedThemes.join(", "), // 선택한 테마
      userId: "current_user_id", // 현재 로그인한 사용자의 ID
    };

    try {
      // 서버에 일정 데이터 전송
      const response = await axios.post("URL", itineraryData);

      // 서버에서 저장된 일정 다시 받아옴
      const savedItinerary = response.data;

      // 마이페이지로 데이터 전달
      navigate("/mypage", { state: { newItinerary: response.data } });
    } catch (error) {
      console.error("일정 저장 오류:", error);
      alert("일정을 저장하는데 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.detailedItineraryPage}>
      {/* 왼쪽 사이드바 영역 */}
      <div className={styles.sidebarContainer}>
        <Sidebar>
          <SidebarTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </Sidebar>
      </div>

      {/* 오른쪽 지도 영역 */}
      <div className={styles.mapContainer}>
        <p>지도 표시 영역 (카카오맵 API 연결 중)</p>
        <button className={styles.confirmButton} onClick={handleConfirmClick}>
          일정 확정하기
        </button>
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <Modal
          title="일정 확정"
          message="일정이 확정되면 마이페이지로 이동됩니다. 일정을 확정하시겠습니까?"
          onClose={handleModalClose}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default DetailedItineraryPage;
