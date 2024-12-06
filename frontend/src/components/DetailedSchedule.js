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

    // 채팅 데이터 처리
    if (chatPlaces) {
      console.log("Processing Chat Data");
      placesData = chatPlaces;
      isChatData = true;
    }
    // 저장된 일정 데이터 처리
    else if (itinerary?.title) {
      console.log("Processing Saved Itinerary Data");
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
        console.error("Error loading saved itinerary data:", error);
        setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
        navigate("/mypage");
        setIsLoading(false);
        return;
      }
    }
    // 데이터가 없는 경우
    else {
      setErrorMessage("데이터를 불러올 수 없습니다.");
      navigate("/mypage");
      setIsLoading(false);
      return;
    }

    console.log("Places Data Before Formatting:", placesData);

    // 데이터 형식 변환
    const formattedData = Object.entries(placesData).map(
      ([dayKey, dayData], index) => {
        const spotArray = Array.isArray(dayData)
          ? dayData // dayData가 배열인 경우
          : Array.isArray(dayData?.spots)
            ? dayData.spots // dayData 안에 spots 배열이 있는 경우
            : []; // 둘 다 아니면 빈 배열

        const validSpots = spotArray.map((spot, idx) => {
          if (!spot || typeof spot !== "object") {
            console.error(`Invalid spot at index ${idx}:`, spot);
            return {
              name: "이름 없음",
              category: "카테고리 없음",
              address: "주소 정보 없음",
            };
          }

          // 주소 필드 처리
          const address =
            isChatData && spot.address
              ? spot.address // 채팅 데이터는 address 사용
              : spot.location || "주소 정보 없음"; // 저장된 데이터는 location 사용

          return {
            name: spot.name || "이름 없음",
            category: spot.category || "카테고리 없음",
            address,
          };
        });

        return {
          displayDay: index + 1,
          originalDay: dayKey.replace(/[^0-9]/g, ""),
          spots: validSpots,
        };
      }
    );

    console.log("Formatted itinerary days:", formattedData);

    // 결과를 상태로 설정
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

  return (
    <div className={styles.detailedSchedule}>
      {isLoading ? (
        <p>일정을 불러오는 중입니다...</p>
      ) : errorMessage ? (
        <p className={styles.error}>{errorMessage}</p>
      ) : (
        <>
          <div className={styles.tabs}>
            {itineraryDays.map((day) => (
              <button
                key={day.displayDay}
                className={`${styles.tabButton} ${
                  activeDay === day.displayDay ? styles.active : ""
                }`}
                onClick={() => setActiveDay(day.displayDay)}
              >
                {`${day.displayDay}일차`}
              </button>
            ))}
          </div>
          <div className={styles.spotList}>
            {itineraryDays
              .find((day) => day.displayDay === activeDay)
              ?.spots.map((spot, idx) => (
                <TravelSpot
                  key={idx}
                  spotData={{
                    name: spot.name,
                    category: spot.category,
                    address: spot.address,
                  }}
                />
              )) || <p>해당 일정에 여행지가 없습니다.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailedSchedule;
