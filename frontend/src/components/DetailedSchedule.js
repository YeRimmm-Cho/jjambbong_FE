import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./DetailedSchedule.module.css";
import { loadDetailedPlan } from "../api/savePlanApi";

const DetailedSchedule = () => {
  const location = useLocation();
  const { itinerary, places: chatPlaces } = location.state || {}; // 전달받은 데이터
  const [activeDay, setActiveDay] = useState(1);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        let placesData = chatPlaces; // 기본적으로 채팅 데이터를 사용
        if (itinerary) {
          // 저장된 일정이 있는 경우 API 호출
          const response = await loadDetailedPlan(
            itinerary.userId,
            itinerary.title
          );
          if (response) {
            placesData = response.places;
          }
        }
        if (placesData) {
          const formattedData = Object.keys(placesData).map((dayKey) => ({
            day: dayKey,
            spots: placesData[dayKey],
          }));
          setItineraryDays(formattedData);
        }
      } catch (error) {
        console.error("상세 일정을 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryData();
  }, [itinerary, chatPlaces]);

  const handleTabClick = (dayIndex) => {
    setActiveDay(dayIndex);
  };

  return (
    <div className={styles.detailedSchedule}>
      <div className={styles.tabs}>
        {itineraryDays.map((day, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              activeDay === index + 1 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(index + 1)}
          >
            {index + 1}일차
          </button>
        ))}
      </div>
      <div className={styles.spotList}>
        {itineraryDays[activeDay - 1]?.spots.map((spot, idx) => (
          <TravelSpot key={idx} spotData={spot} />
        )) || <p>데이터를 불러오는 중입니다...</p>}
      </div>
    </div>
  );
};

export default DetailedSchedule;
