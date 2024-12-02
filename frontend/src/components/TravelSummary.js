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
  const [formattedTags, setFormattedTags] = useState([]);

  // 사용자 닉네임 가져오기
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && typeof userInfo.nickname === "string") {
      setUserName(userInfo.nickname);
    }
  }, []);

  // 데이터 처리
  useEffect(() => {
    const {
      itinerary,
      places: chatPlaces,
      hashTags: chatHashTags,
    } = location.state || {};

    if (chatPlaces && chatHashTags) {
      // location.state에서 받은 데이터 처리
      processHashTags(chatHashTags);
      const totalPlaces = Object.values(chatPlaces).flat().length;
      const totalDays = Object.keys(chatPlaces).length;

      setPlaces(chatPlaces);
      setItinerarySummary({
        totalPlaces,
        tags: chatHashTags,
        totalDays,
      });

      const highlights = Object.keys(chatPlaces).map((dayKey) => ({
        day: dayKey,
        highlights: chatPlaces[dayKey],
      }));
      setSampleHighlights(highlights);
    } else if (itinerary) {
      // itinerary가 있는 경우 API 호출
      fetchSavedItinerary(itinerary);
    } else {
      // 데이터가 없는 경우 경고 및 리다이렉트
      alert("일정 데이터가 없습니다. 채팅을 통해 새로운 계획을 생성해주세요.");
      navigate("/new");
    }
  }, [location.state, navigate]);

  // 해시태그 처리 함수
  const processHashTags = (tags) => {
    if (Array.isArray(tags)) {
      // 배열 형태의 해시태그 처리
      setFormattedTags(tags.filter((tag) => tag.startsWith("#")));
    } else if (typeof tags === "string") {
      // 문자열 형태의 해시태그 처리
      const formatted = tags.split(" ").filter((tag) => tag.startsWith("#"));
      setFormattedTags(formatted);
    }
  };

  // API 호출 함수
  const fetchSavedItinerary = async (itinerary) => {
    try {
      const response = await loadDetailedPlan(
        itinerary.userId,
        itinerary.title
      );
      if (response) {
        const apiHashTags = response.location_info?.hash_tag || [];
        processHashTags(apiHashTags);

        const totalPlaces = Object.values(response.places).flat().length;
        const totalDays = Object.keys(response.places).length;

        setPlaces(response.places);
        setItinerarySummary({
          totalPlaces,
          tags: apiHashTags,
          totalDays,
        });

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
          {formattedTags.map((tag, index) => (
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
