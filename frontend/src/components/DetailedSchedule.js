import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./DetailedSchedule.module.css";
import { loadDetailedPlan } from "../api/savePlanApi";

const DetailedSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, places: chatPlaces } = location.state || {};
  const [itineraryDays, setItineraryDays] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDataProcessing = async () => {
    let placesData = {};
    let isChatData = false;

    if (chatPlaces) {
      placesData = chatPlaces;
      isChatData = true;
    } else if (itinerary?.title) {
      const userId = localStorage.getItem("userId");
      const travelName = itinerary.title;

      if (!userId || !travelName) {
        setErrorMessage("사용자 ID 또는 여행 이름이 누락되었습니다.");
        navigate("/mypage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await loadDetailedPlan(userId, travelName);
        placesData = response?.plan?.places || {};
        isChatData = false;
      } catch (error) {
        setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
        navigate("/mypage");
        setIsLoading(false);
        return;
      }
    } else {
      setErrorMessage("데이터를 불러올 수 없습니다.");
      navigate("/mypage");
      setIsLoading(false);
      return;
    }

    console.log("Places Data Before Formatting:", placesData);

    const formattedData = Object.entries(placesData)
      .map(([dayKey, dayData], index) => {
        const spots = Array.isArray(dayData.spots) ? dayData.spots : [];

        const validSpots = spots.map((spot, idx) => {
          if (!spot || typeof spot !== "object") {
            console.error(`Invalid spot at index ${idx}:`, spot);
            return {
              name: "이름 없음",
              category: "카테고리 없음",
              address: "주소 정보 없음",
            };
          }

          return {
            name: spot.name || "이름 없음",
            category: spot.category || "카테고리 없음",
            address: spot.location || "주소 정보 없음",
          };
        });

        return {
          displayDay: index + 1,
          originalDay: dayKey.replace(/[^0-9]/g, ""),
          spots: validSpots,
        };
      })
      .filter((day) => day.spots.length > 0)
      .sort((a, b) => a.originalDay - b.originalDay);

    console.log("Formatted itinerary days:", formattedData);

    if (formattedData.length > 0) {
      setItineraryDays(formattedData);
      setActiveDay(formattedData[0]?.displayDay || null);
    } else {
      setErrorMessage("일정 데이터가 없습니다.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleDataProcessing();
  }, [chatPlaces, itinerary, navigate]);

  const handleTabClick = (displayDay) => {
    setActiveDay(displayDay);
  };

  return (
    <div className={styles.detailedSchedule}>
      {isLoading ? (
        <p>일정을 불러오는 중입니다...</p>
      ) : errorMessage ? (
        <p className={styles.error}>{errorMessage}</p>
      ) : itineraryDays.length === 0 ? (
        <p className={styles.error}>해당 일정에 여행지가 없습니다.</p>
      ) : (
        <>
          {/* 탭 버튼 자동으로 렌더링 */}
          <div className={styles.tabs}>
            {itineraryDays.map((day) => (
              <button
                key={day.displayDay}
                className={`${styles.tabButton} ${
                  activeDay === day.displayDay ? styles.active : ""
                }`}
                onClick={() => handleTabClick(day.displayDay)}
              >
                {`${day.displayDay}일차`}
              </button>
            ))}
          </div>

          {/* 여행지 리스트 */}
          <div className={styles.spotList}>
            {itineraryDays.find((day) => day.displayDay === activeDay)?.spots
              .length > 0 ? (
              itineraryDays
                .find((day) => day.displayDay === activeDay)
                .spots.map((spot, idx) => (
                  <TravelSpot
                    key={idx}
                    spotData={{
                      name: spot.name,
                      category: spot.category,
                      address: spot.address,
                    }}
                  />
                ))
            ) : (
              <p>해당 일정에 여행지가 없습니다.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailedSchedule;
