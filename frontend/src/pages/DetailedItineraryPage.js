import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SidebarTabs from "../components/SidebarTabs";
import TravelSummary from "../components/TravelSummary";
import DetailedSchedule from "../components/DetailedSchedule";
import Route from "../components/Route";
import Checklist from "../components/Checklist";
import Modal from "../components/Modal";
import InputModal from "../components/InputModal";
import styles from "./DetailedItineraryPage.module.css";
import KakaoMap from "../components/KakaoMap";
import axios from "axios";

function DetailedItineraryPage() {
  const location = useLocation(); // 이전 페이지에서 상태 가져오기
  const {
    savedMessages = [],
    places: initialPlaces = null,
    hashTags = [],
    dateRange: initialDateRange = [null, null],
    selectedCompanion: initialCompanion = null,
    selectedThemes: initialThemes = [],
  } = location.state || {};

  const [activeTab, setActiveTab] = useState("여행 요약");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [selectedThemes, setSelectedThemes] = useState(initialThemes);
  const [selectedCompanion, setSelectedCompanion] = useState(initialCompanion);
  const [places, setPlaces] = useState(initialPlaces);
  const [travelName, setTravelName] = useState(""); // 일정 제목 저장
  const navigate = useNavigate();

  const tabs = [
    { label: "여행 요약", content: <TravelSummary /> },
    { label: "상세 일정", content: <DetailedSchedule /> },
    { label: "길찾기", content: <Route /> },
    { label: "체크리스트", content: <Checklist /> },
  ];

  useEffect(() => {
    // 상태를 sessionStorage에 저장
    sessionStorage.setItem("dateRange", JSON.stringify(dateRange));
    sessionStorage.setItem("selectedCompanion", selectedCompanion);
    sessionStorage.setItem("selectedThemes", JSON.stringify(selectedThemes));
    sessionStorage.setItem("places", JSON.stringify(places));
  }, [dateRange, selectedCompanion, selectedThemes, places]);

  const handleBack = () => {
    // 이전 페이지로 이동 시 상태 전달
    navigate(-1, {
      state: {
        savedMessages,
        places,
        hashTags,
        dateRange,
        selectedCompanion,
        selectedThemes,
      },
    });
  };

  // 일정 확정 모달 열기
  const handleConfirmClick = () => {
    setIsModalOpen(true);
  };

  // 일정 확정 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 제목 입력 모달 열기
  const handleOpenInputModal = () => {
    setIsModalOpen(false); // 일정 확정 모달 닫기
    setIsInputModalOpen(true); // 제목 입력 모달 열기
  };

  // 제목 입력 모달 닫기
  const handleInputModalClose = () => {
    setIsInputModalOpen(false);
  };

  // 제목 입력 확인
  const handleInputModalConfirm = async (title) => {
    setTravelName(title); // 제목 저장
    setIsInputModalOpen(false); // 제목 입력 모달 닫기

    const itineraryData = {
      title,
      date: `${dateRange[0]?.toLocaleDateString()} ~ ${dateRange[1]?.toLocaleDateString()}`,
      tags: selectedThemes.join(", "),
      userId: "current_user_id",
    };

    try {
      const response = await axios.post("URL", itineraryData);
      navigate("/mypage", { state: { newItinerary: response.data } });
    } catch (error) {
      console.error("일정 저장 오류:", error);
      alert("일정을 저장하는 데 문제가 발생했습니다.");
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
        <KakaoMap />
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
          onConfirm={handleOpenInputModal}
        />
      )}

      {/* 제목 입력 모달 */}
      {isInputModalOpen && (
        <InputModal
          title="일정 제목 입력"
          description="확정할 일정의 제목을 입력해주세요."
          placeholder="ex) 제주도 가족여행"
          onClose={handleInputModalClose}
          onConfirm={handleInputModalConfirm}
        />
      )}
    </div>
  );
}

export default DetailedItineraryPage;
