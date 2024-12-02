import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./TravelSummary.module.css";
import { loadDetailedPlan } from "../api/savePlanApi";

function TravelSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("사용자");
  const [itinerarySummary, setItinerarySummary] = useState({
    totalPlaces: 0,
    tags: [],
    totalDays: 0,
  });
  const [sampleHighlights, setSampleHighlights] = useState([]);
  const [places, setPlaces] = useState(null);
  const [hashTags, setHashTags] = useState([]);

  // 사용자 닉네임 가져오기
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && typeof userInfo.nickname === "string") {
      setUserName(userInfo.nickname);
    }
  }, []);

  useEffect(() => {
    const {
      itinerary,
      places: chatPlaces,
      hashTags: chatHashTags,
    } = location.state || {};

    // 저장된 일정 API 호출
    const fetchSavedItinerary = async () => {
      try {
        const response = await loadDetailedPlan(
          itinerary.userId,
          itinerary.title
        );
        if (response) {
          const uniqueTags = [...new Set(response.hashTags || [])];
          const totalPlaces = Object.values(response.places).flat().length;
          const totalDays = Object.keys(response.places).length;

          setPlaces(response.places);
          setHashTags(uniqueTags);
          setItinerarySummary({
            totalPlaces,
            tags: uniqueTags, // 중복 제거된 태그
            totalDays,
          });

          // 하이라이트 데이터 생성
          const highlights = Object.keys(response.places).map((dayKey) => ({
            day: dayKey,
            highlights: response.places[dayKey],
          }));
          setSampleHighlights(highlights);
        }
      } catch (error) {
        console.error("저장된 일정 데이터를 불러오는 데 실패했습니다.", error);
        alert(
          "저장된 일정 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요."
        );
        navigate("/mypage");
      }
    };

    if (itinerary) {
      // 저장된 일정 데이터가 있는 경우 API 호출
      fetchSavedItinerary();
    } else if (chatPlaces) {
      // 채팅 데이터를 사용하는 경우
      const uniqueTags = [...new Set(chatHashTags || [])];
      const totalPlaces = Object.values(chatPlaces).flat().length;
      const totalDays = Object.keys(chatPlaces).length;

      setPlaces(chatPlaces);
      setHashTags(uniqueTags);
      setItinerarySummary({
        totalPlaces,
        tags: uniqueTags,
        totalDays,
      });

      // 하이라이트 데이터 생성
      const highlights = Object.keys(chatPlaces).map((dayKey) => ({
        day: dayKey,
        highlights: chatPlaces[dayKey],
      }));
      setSampleHighlights(highlights);
    } else {
      // 데이터가 없는 경우 경고 및 채팅 페이지로 리다이렉트
      alert("일정 데이터가 없습니다. 채팅을 통해 새로운 계획을 생성해주세요.");
      navigate("/new");
    }
  }, [location.state, navigate]);

  return (
    <div className={styles.container}>
      {/* 여행 요약 카드 */}
      <div className={styles.itinerarySummary}>
        <p>
          <b>{userName}</b>님을 위한 {itinerarySummary.totalDays - 1}박{" "}
          {itinerarySummary.totalDays}일 여행코스
        </p>
        <p>
          총 <b>{itinerarySummary.totalPlaces}</b>개의 여행지/음식점/카페
        </p>
        <div className={styles.tagsContainer}>
          {hashTags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 여행 하이라이트 */}
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
                    address: spot.address || "주소 정보 없음",
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
