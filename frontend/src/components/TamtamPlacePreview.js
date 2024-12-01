import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import TravelSpot from "./TravelSpot";
import styles from "./TamtamPlacePreview.module.css";

function TamtamPlacePreview({ places, hashTags }) {
  const [selectedDay, setSelectedDay] = useState("Day 1"); // 기본값 설정
  const [days, setDays] = useState(["Day 1"]);
  const [restoredHashTags, setRestoredHashTags] = useState(hashTags || []); // hashTags 복원 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (places && Object.keys(places).length > 0) {
      const dayKeys = Object.keys(places); // 날짜별 키 추출
      setDays(dayKeys); // 날짜 리스트 업데이트
      setSelectedDay(dayKeys[0]);
    } else {
      setDays(["Day 1"]); // 데이터가 없으면 기본값 "Day 1" 유지
      setSelectedDay("Day 1");
    }
  }, [places]);

  useEffect(() => {
    // hashTags가 없으면 sessionStorage에서 복원
    if (!hashTags || hashTags.length === 0) {
      const savedHashTags =
        JSON.parse(sessionStorage.getItem("hashTags")) || [];
      setRestoredHashTags(savedHashTags);
    } else {
      // 전달된 hashTags를 sessionStorage에 저장
      sessionStorage.setItem("hashTags", JSON.stringify(hashTags));
    }
  }, [hashTags]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewTitle}>
        <p>추천 장소 미리보기</p>
      </div>
      <div className={styles.previewSection}>
        {/* 드롭다운과 상세보기 버튼 */}
        <div className={styles.dropdownContainer}>
          <Dropdown
            options={days}
            selectedOption={selectedDay}
            onOptionSelect={setSelectedDay}
          />
          <button
            className={styles.detailButton}
            onClick={() => {
              const savedMessages =
                JSON.parse(sessionStorage.getItem("chatMessages")) || [];
              const savedDateRange =
                JSON.parse(sessionStorage.getItem("dateRange")) || [];
              const savedCompanion =
                sessionStorage.getItem("selectedCompanion");
              const savedThemes =
                JSON.parse(sessionStorage.getItem("selectedThemes")) || [];
              navigate("/detailed-itinerary", {
                state: {
                  places,
                  hashTags: restoredHashTags,
                  savedMessages,
                  dateRange: savedDateRange,
                  selectedCompanion: savedCompanion,
                  selectedThemes: savedThemes,
                },
              });
            }}
          >
            여행 상세 일정 확인하기
          </button>
        </div>

        {/* 장소 리스트 */}
        <div className={styles.placeList}>
          {places ? (
            places[selectedDay]?.length > 0 ? (
              places[selectedDay].map((spot, index) => (
                <TravelSpot
                  key={index}
                  spotData={{
                    imageUrl: spot.imageUrl || "",
                    name: spot.name,
                    category: spot.category,
                    address: spot.address || "주소 정보 없음", // 기본값 처리
                  }}
                />
              ))
            ) : (
              <p>선택한 날짜에 장소 정보가 없습니다.</p>
            )
          ) : (
            <p>일정이 생성되면 장소를 보여드릴게요!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TamtamPlacePreview;
