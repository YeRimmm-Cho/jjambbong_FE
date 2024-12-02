import React from "react";
import styles from "./MyItinerary.module.css";
import { useNavigate } from "react-router-dom";
import { loadDetailedPlan } from "../api/savePlanApi";

function MyItinerary({ itinerary, userId }) {
  const navigate = useNavigate();

  // 카드 클릭 시 상세 일정 페이지 형태로 보임
  const handleCardClick = async () => {
    try {
      const detailResponse = await loadDetailedPlan(userId, itinerary.title); // 상세 계획 불러오기
      if (detailResponse) {
        navigate(`/itinerary/${itinerary.id}`, {
          state: { detail: detailResponse, itinerary }, // 데이터 전달
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
      {/* 일단 기본 이미지 표시 */}
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
