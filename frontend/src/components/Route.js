import React, { useState, useEffect } from "react";
import styles from "./Route.module.css";

const Route = () => {
  const [activeDay, setActiveDay] = useState(1); // 현재 활성화된 날짜
  const [itineraryDays, setItineraryDays] = useState([]); // 여행 일정 데이터
  const [coordinatesLog, setCoordinatesLog] = useState([]); // 좌표 확인 로그

  useEffect(() => {
    // Kakao Maps API 로드 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
    } else {
      console.log("Kakao Maps API 로드 성공");
    }

    // 여행 데이터 로드
    async function fetchItineraryData() {
      try {
        const response = await fetch("/mockdata/mockItinerary.json");
        if (!response.ok) {
          throw new Error("Failed to fetch itinerary data");
        }
        const data = await response.json();

        const formattedData = Object.keys(data).map((dayKey) => ({
          day: dayKey,
          spots: data[dayKey],
        }));
        setItineraryDays(formattedData);
      } catch (error) {
        console.error("Error fetching itinerary data:", error);
      }
    }

    fetchItineraryData();
  }, []);

  // 탭 버튼 클릭
  const handleTabClick = (dayIndex) => {
    setActiveDay(dayIndex);
  };

  // 주소를 좌표로 변환
  const getCoordinates = async (address) => {
    console.log("주소 요청 중:", address); // 요청 디버깅
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        console.log("addressSearch 결과:", result, status); // 결과 디버깅

        if (status === window.kakao.maps.services.Status.OK) {
          const coordinates = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          };
          console.log("좌표 변환 성공:", coordinates); // 성공 디버깅
          setCoordinatesLog((prev) => [...prev, { address, coordinates }]);
          resolve(coordinates);
        } else {
          console.error("좌표 변환 실패:", address, status); // 실패 디버깅
          reject(
            new Error("Failed to find coordinates for address: " + address)
          );
        }
      });
    });
  };

  // 출발지-도착지 경로 쌍 생성
  const createRoutePairs = (spots) => {
    const pairs = [];
    for (let i = 0; i < spots.length - 1; i++) {
      pairs.push([spots[i], spots[i + 1]]);
    }
    return pairs;
  };

  const createKakaoMapLink = async (start, end) => {
    try {
      const startCoords = await getCoordinates(start.address);
      const endCoords = await getCoordinates(end.address);

      const baseUrl = "https://map.kakao.com/link";
      const fromInfo = `from/${encodeURIComponent(start.name)},${startCoords.lat},${startCoords.lng}`;
      const toInfo = `to/${encodeURIComponent(end.name)},${endCoords.lat},${endCoords.lng}`;
      return `${baseUrl}/${fromInfo}/${toInfo}`;
    } catch (error) {
      console.error("Error creating Kakao map link:", error);
      return "#";
    }
  };

  return (
    <div className={styles.detailedSchedule}>
      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        {itineraryDays.map((day, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              activeDay === index + 1 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(index + 1)}
          >
            {index + 1}일차
          </button>
        ))}
      </div>

      {/* 선택된 날짜의 여행 스팟과 길찾기 경로 */}
      <div className={styles.routeList}>
        {itineraryDays[activeDay - 1]?.spots &&
          createRoutePairs(itineraryDays[activeDay - 1].spots).map(
            ([start, end], idx) => (
              <div key={idx} className={styles.routeItem}>
                <div
                  className={styles.routeDetails}
                  onClick={async () => {
                    const kakaoLink = await createKakaoMapLink(start, end);
                    window.open(kakaoLink, "_blank");
                  }}
                >
                  {/* 출발지 정보 */}
                  <div className={styles.spotInfo}>
                    <div className={styles.imageContainer}>
                      <img
                        src={start.imageUrl}
                        alt={start.name}
                        className={styles.spotImage}
                      />
                      <span className={styles.imageLabel}>{start.name}</span>
                    </div>
                  </div>

                  {/* 화살표 표시 */}
                  <div className={styles.arrow}>→</div>

                  {/* 도착지 정보 */}
                  <div className={styles.spotInfo}>
                    <div className={styles.imageContainer}>
                      <span className={styles.imageLabel}>{end.name}</span>
                      <img
                        src={end.imageUrl}
                        alt={end.name}
                        className={styles.spotImage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default Route;
