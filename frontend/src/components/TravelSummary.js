import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TravelSummary.module.css";
import TravelSpot from "./TravelSpot";
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
  const [formattedTags, setFormattedTags] = useState([]);

  const {
    itinerary,
    places: chatPlaces,
    hashTags: chatHashTags,
  } = location.state || {};

  // 데이터 처리 함수
  const handleDataProcessing = useCallback(async () => {
    let placesData = {};
    let tags = [];
    let isChatData = false;

    if (chatPlaces && chatHashTags) {
      placesData = chatPlaces;
      tags = chatHashTags;
      isChatData = true;
    } else if (itinerary?.title) {
      try {
        const userId = localStorage.getItem("userId");
        const travelName = itinerary.title;

        if (!userId || !travelName) {
          alert(
            "사용자 ID 또는 여행 이름이 누락되었습니다. 마이 페이지로 이동합니다."
          );
          navigate("/mypage");
          return;
        }

        const response = await loadDetailedPlan(userId, travelName);
        placesData = response?.plan?.places || {};
        tags = response?.plan?.hash_tag || [];
        isChatData = false;
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        alert("일정 데이터를 불러오는 데 실패했습니다.");
        navigate("/mypage");
        return;
      }
    } else {
      console.error("데이터가 없습니다.");
      alert("데이터를 가져올 수 없습니다.");
      navigate("/mypage");
      return;
    }

    const processedPlaces = Object.entries(placesData).map(
      ([dayKey, spots]) => {
        const validSpots = Array.isArray(spots)
          ? spots.map((spot) => ({
              name: spot.name || "이름 없음",
              address: isChatData
                ? spot.address || "주소 정보 없음"
                : spot.location || "주소 정보 없음",
              category: spot.category || "카테고리 없음",
              imageUrl: spot.imageUrl || null, // imageUrl 그대로 사용
            }))
          : [];
        return {
          day: isChatData ? dayKey : dayKey.replace("day", ""),
          highlights: validSpots,
        };
      }
    );

    setSampleHighlights(processedPlaces);
    const totalPlaces = processedPlaces.reduce(
      (sum, day) => sum + day.highlights.length,
      0
    );
    const totalDays = processedPlaces.length;

    setItinerarySummary({ totalPlaces, tags, totalDays });
    processHashTags(tags);
  }, [chatPlaces, chatHashTags, itinerary, navigate]);

  // useEffect에서 handleDataProcessing 호출
  useEffect(() => {
    handleDataProcessing();
  }, [handleDataProcessing]);

  // 해시태그 처리 함수
  const processHashTags = (tags) => {
    if (Array.isArray(tags)) {
      setFormattedTags(tags.filter((tag) => tag.startsWith("#")));
    } else if (typeof tags === "string") {
      setFormattedTags(
        tags.split(/[\s,]+/).filter((tag) => tag.startsWith("#"))
      );
    } else {
      setFormattedTags([]);
    }
  };

  // 사용자 이름 로드
  useEffect(() => {
    const nickname = localStorage.getItem("nickname") || "사용자";
    setUserName(nickname);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.itinerarySummary}>
        <p>
          <b>{userName}</b>님을 위한{" "}
          {itinerarySummary.totalDays > 0 ? itinerarySummary.totalDays - 1 : 0}
          박 {itinerarySummary.totalDays}일 여행코스
        </p>
        <p>
          총 <b>{itinerarySummary.totalPlaces}</b>개의 여행지/음식점/카페
        </p>
        <div className={styles.tagsContainer}>
          {formattedTags.length > 0 ? (
            formattedTags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))
          ) : (
            <span>No hashtags available</span>
          )}
        </div>
      </div>

      <div className={styles.highlights}>
        {sampleHighlights.map((day) => (
          <div key={day.day} className={styles.dayHighlights}>
            <h3>{day.day}</h3>
            <div className={styles.places}>
              {day.highlights.length > 0 ? (
                day.highlights.map((spot, index) => (
                  <TravelSpot
                    key={index}
                    spotData={{
                      name: spot.name || "이름 없음",
                      category: spot.category || "카테고리 없음",
                      address: spot.address,
                      imageUrl: spot.imageUrl, // imageUrl 그대로 전달
                    }}
                  />
                ))
              ) : (
                <p>여행지 정보가 없습니다.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelSummary;
