import React from "react";
import styles from "./MyItinerary.module.css";
import { useNavigate } from "react-router-dom";
import { loadDetailedPlan } from "../api/savePlanApi";

function MyItinerary({ itinerary }) {
  const navigate = useNavigate();

  // localStorage에서 userId 가져오기
  const currentUserId = localStorage.getItem("userId");

  // 카드 클릭 시 상세 일정 페이지로 이동
  const handleCardClick = async () => {
    try {
      if (!currentUserId) {
        alert("사용자 ID가 없습니다. 로그인이 필요합니다.");
        return;
      }

      if (!itinerary?.title) {
        alert("여행 이름이 누락되었습니다.");
        return;
      }

      // API 요청 데이터 확인
      const requestData = {
        user_id: currentUserId, // API에서 요구하는 키 이름
        travel_name: itinerary.title, // 여행 제목
      };
      console.log("요청 데이터:", requestData);

      // API 호출
      const detailResponse = await loadDetailedPlan(
        requestData.user_id,
        requestData.travel_name
      );
      console.log("상세 계획 데이터:", detailResponse);

      // 응답 데이터 처리
      if (detailResponse?.plan?.places) {
        const places = detailResponse.plan.places;
        const formattedPlaces = Object.entries(places).map(([day, spots]) => ({
          day,
          spots,
        }));

        console.log("Navigate 데이터:", { itinerary, places: formattedPlaces });

        // 상세 페이지로 이동
        navigate(`/detailed-itinerary`, {
          state: {
            itinerary,
            places: formattedPlaces,
          },
        });
      } else {
        alert("상세 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("상세 여행 계획 불러오기 실패:", error);
      alert("상세 정보를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <img
        src="/mockdata/img_example.jpg"
        alt="대표 이미지"
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{itinerary.title}</h3>
        {itinerary.tags && (
          <div className={styles.tags}>
            {itinerary.tags.split(",").map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
        <div className={styles.date}>{itinerary.date}</div>
      </div>
    </div>
  );
}

export default MyItinerary;
