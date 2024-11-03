import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import TravelSpot from "./TravelSpot";
import styles from "./TamtamPlacePreview.module.css";

function TamtamPlacePreview({ itinerary, onDetailsClick }) {
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [days, setDays] = useState([]);

  // TODO: 실제 데이터가 준비되면 이 부분을 API 호출로 대체
  const travelSpotsByDay = {
    "Day 1": [
      {
        imageUrl:
          "https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2UUt/image/TSmJaDFfaa1GqxpuFnsnsFwbgp0",
        name: "성산일출봉",
        category: "여행지",
        info: "봉우리, 고지",
        address: "제주특별자치도 서귀포시 성산읍 성산리 1",
      },
      {
        imageUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyNDA1MzBfMiAg/MDAxNzE3MDEwNzc2NDc0.lLWJXnjCp9VJ9IZVGKmevXwB7LdiFcNVKpZAwWj8z9Yg.mfzIVpwKZQl6WNolSZ9BYrN8ZCuDdlrG5MKOu3ekbr4g.JPEG/%ED%95%B4%EC%86%A1_(84)_batch.jpg?type=w800",
        name: "해송갈치 제주성산일출봉점",
        category: "음식점",
        info: "해물, 생선요리",
        address: "제주 서귀포시 성산읍 일출로 270-2",
      },
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWB8QJSlpL5zTtoZSJacZothXvLmYZP0rOWiO7jFfxkJjR2PdtjbIL3aYZPWd3deHUscA&usqp=CAU",
        name: "오조포구",
        category: "여행지",
        info: "페리, 해운",
        address: "제주 서귀포시 성산읍 오조리",
      },
      {
        imageUrl:
          "https://vmspace.com/ActiveFile/spacem.org/board_img/16431394826123257072c40.jpg",
        name: "오른",
        category: "카페",
        info: "카페, 디저트",
        address: "제주 서귀포시 성산읍 해맞이해안로 2714",
      },
    ],
    "Day 2": [
      {
        imageUrl:
          "https://minio.nculture.org/amsweb-opt/multimedia_assets/191/85886/94446/c/%EC%98%A4%EC%84%A4%EB%A1%9D-%ED%8B%B0-%EB%AE%A4%EC%A7%80%EC%97%84-%287%29_rev-medium-size.jpg",
        name: "제주 오설록 티뮤지엄",
        category: "박물관, 카페, 쇼핑",
        info: "카페, 디저트",
        address: "제주 서귀포시 안덕면 신화역사로 15",
      },
    ],
    // 추가 날짜별 가짜 데이터가 필요할 경우 여기에 추가
  };

  useEffect(() => {
    if (itinerary) {
      const dayOptions = Array.from(
        { length: itinerary },
        (_, i) => `Day ${i + 1}`
      );
      setDays(dayOptions);
      setSelectedDay(dayOptions[0]); // 기본값 설정
    }

    // TODO: 실제 데이터가 준비되면 이 부분을 활성화
    // async function fetchTravelSpots() {
    //   const response = await fetch("https://api.example.com/travelSpots");
    //   const data = await response.json();
    //   // 날짜별로 데이터 정리
    //   const spotsByDay = data.reduce((acc, spot) => {
    //     const dayKey = `Day ${spot.day}`;
    //     if (!acc[dayKey]) acc[dayKey] = [];
    //     acc[dayKey].push(spot);
    //     return acc;
    //   }, {});
    //   setTravelSpotsByDay(spotsByDay);
    // }
    // fetchTravelSpots();
  }, [itinerary]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previeTitle}>
        <p>추천 장소 미리보기</p>
      </div>
      <div className={styles.previewSection}>
        <div className={styles.dropdownContainer}>
          <Dropdown
            options={days}
            selectedOption={selectedDay}
            onOptionSelect={setSelectedDay}
          />
          <button className={styles.detailButton} onClick={onDetailsClick}>
            여행 상세 일정 확인하기
          </button>
        </div>
        <div className={styles.placeList}>
          {travelSpotsByDay[selectedDay]?.map((spot, index) => (
            <TravelSpot key={index} spotData={spot} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TamtamPlacePreview;
