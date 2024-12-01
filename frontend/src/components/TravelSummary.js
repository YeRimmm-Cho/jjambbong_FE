import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./TravelSummary.module.css";

function TravelSummary({ userName = "예림" }) {
  const location = useLocation(); // react-router-dom에서 useLocation 가져오기
  const [itinerarySummary, setItinerarySummary] = useState({
    totalPlaces: 0,
    tags: [],
    totalDays: 0,
  });
  const [sampleHighlights, setSampleHighlights] = useState([]);

  useEffect(() => {
    // location에서 데이터 가져옴
    const { places, hashTags } = location.state || {};
    const savedHashTags = JSON.parse(sessionStorage.getItem("hashTags")) || [];

    const tags = hashTags?.length ? hashTags : savedHashTags;

    if (places) {
      const totalPlaces = Object.values(places).flat().length;
      const dayKeys = Object.keys(places);
      const totalDays = dayKeys.length;

      console.log("Processed HashTags:", hashTags);

      setItinerarySummary({
        totalPlaces,
        tags,
        totalDays,
      });

      const highlights = dayKeys.map((dayKey) => ({
        day: dayKey,
        highlights: places[dayKey],
      }));
      setSampleHighlights(highlights);
    }
  }, [location.state]);

  return (
    <div className={styles.container}>
      {/* 요약 카드 */}
      <div className={styles.itinerarySummary}>
        <p>
          <b>{userName}</b>님을 위한 {itinerarySummary.totalDays - 1}박{" "}
          {itinerarySummary.totalDays}일 여행코스
        </p>
        <p>
          총 <b>{itinerarySummary.totalPlaces}</b>개의 여행지/음식점/카페
        </p>
        <div className={styles.tagsContainer}>
          {itinerarySummary.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 하이라이트 */}
      <div className={styles.highlights}>
        {sampleHighlights.map((day) => (
          <div key={day.day} className={styles.dayHighlights}>
            <h3>{day.day}</h3>
            <div className={styles.places}>
              {day.highlights.map((spot, index) => (
                <TravelSpot
                  key={index}
                  spotData={{
                    name: spot.name,
                    category: spot.category,
                    address: spot.address || "주소 정보 없음", // 주소 필드 변경
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelSummary;
