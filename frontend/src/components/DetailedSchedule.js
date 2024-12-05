import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./DetailedSchedule.module.css";
import { loadDetailedPlan } from "../api/savePlanApi";

const DetailedSchedule = () => {
  const { id } = useParams(); // URL 매개변수에서 ID 가져오기
  const location = useLocation(); // 전달받은 데이터 확인
  const { places: chatPlaces } = location.state || {}; // 채팅에서 전달된 데이터 (있을 경우)

  const [activeDay, setActiveDay] = useState(1); // 현재 활성화된 탭
  const [itineraryDays, setItineraryDays] = useState([]); // 일정 데이터

  useEffect(() => {
    const fetchItineraryData = async () => {
      let placesData = chatPlaces;

      if (!chatPlaces) {
        const response = await loadDetailedPlan(id);
        placesData = response?.plan?.places;
      }

      // 데이터 포맷 변경
      const formattedData = Object.entries(placesData).map(
        ([dayKey, spots]) => ({
          day: dayKey,
          spots: Array.isArray(spots) ? spots : [], // spots가 배열이 아닌 경우 빈 배열로 초기화
        })
      );

      setItineraryDays(formattedData);
    };

    fetchItineraryData();
  }, [chatPlaces, id]); // chatPlaces 또는 id 변경 시 실행

  // 탭 클릭 핸들러
  const handleTabClick = (dayIndex) => {
    setActiveDay(dayIndex);
  };

  return (
    <div className={styles.detailedSchedule}>
      {/* 일정 탭 */}
      <div className={styles.tabs}>
        {itineraryDays.map((day, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeDay === index + 1 ? styles.active : ""}`}
            onClick={() => handleTabClick(index + 1)}
          >
            {index + 1}일차
          </button>
        ))}
      </div>

      {/* 일정 데이터 렌더링 */}
      <div className={styles.spotList}>
        {itineraryDays[activeDay - 1]?.spots.map((spot, idx) => (
          <TravelSpot key={idx} spotData={spot} />
        )) || <p>일정을 불러오는 중입니다...</p>}
      </div>
    </div>
  );
};

export default DetailedSchedule;
