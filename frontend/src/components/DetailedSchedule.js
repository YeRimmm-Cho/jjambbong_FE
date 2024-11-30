import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./DetailedSchedule.module.css";

const DetailedSchedule = () => {
  const location = useLocation();
  const rawPlaces = location.state?.places || {}; // 전달받은 places 데이터
  const [activeDay, setActiveDay] = useState(1);
  const [itineraryDays, setItineraryDays] = useState([]);

  useEffect(() => {
    if (rawPlaces) {
      const formattedData = Object.keys(rawPlaces).map((dayKey) => ({
        day: dayKey,
        spots: rawPlaces[dayKey],
      }));
      setItineraryDays(formattedData);
    }
  }, [rawPlaces]);

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
