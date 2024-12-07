import React, { useEffect, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import tamtam from "../assets/images/tamtam.svg";

// PolylineComponent: 마커를 선으로 연결
function PolylineComponent({ positions }) {
  const map = useMap();

  useEffect(() => {
    const { kakao } = window;

    if (!map || positions.length < 2) return;

    const linePath = positions.map(
      (position) =>
        new kakao.maps.LatLng(position.latlng.lat, position.latlng.lng)
    );

    const polyline = new kakao.maps.Polyline({
      map,
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#FFAE00",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });

    return () => polyline.setMap(null); // 컴포넌트 언마운트 시 제거
  }, [map, positions]);

  return null;
}

function KakaoMap() {
  const [positions, setPositions] = useState([]);
  const [infoVisibleIndex, setInfoVisibleIndex] = useState(null); // 인포텍스트 표시 상태

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps || !kakao.maps.services) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const places = new kakao.maps.services.Places();

    async function fetchItineraryFromSessionStorage() {
      try {
        const storedData = sessionStorage.getItem("places");
        if (!storedData) {
          console.error("세션 스토리지에 'places' 키가 없습니다.");
          return;
        }

        const parsedData = JSON.parse(storedData);
        const fetchedPositions = [];

        for (const dayKey in parsedData) {
          const daySpots = parsedData[dayKey];
          for (const spot of daySpots) {
            const { name, address } = spot;

            await new Promise((resolve) => {
              geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                  // 주소 좌표 변환 성공
                  const coordinates = {
                    title: name,
                    latlng: {
                      lat: parseFloat(result[0].y),
                      lng: parseFloat(result[0].x),
                    },
                  };
                  fetchedPositions.push(coordinates);
                  resolve();
                } else if (
                  status === kakao.maps.services.Status.ZERO_RESULT &&
                  result?.length > 0
                ) {
                  // 유사 주소를 사용
                  const similarAddress = result[0];
                  const coordinates = {
                    title: name,
                    latlng: {
                      lat: parseFloat(similarAddress.y),
                      lng: parseFloat(similarAddress.x),
                    },
                  };
                  fetchedPositions.push(coordinates);
                  resolve();
                } else {
                  // "제주 + name"으로 키워드 검색
                  places.keywordSearch(
                    `제주 ${name}`,
                    (results, keywordStatus) => {
                      if (
                        keywordStatus === kakao.maps.services.Status.OK &&
                        results.length > 0
                      ) {
                        const keywordCoordinates = {
                          title: results[0].place_name, // 검색된 첫 번째 장소
                          latlng: {
                            lat: parseFloat(results[0].y),
                            lng: parseFloat(results[0].x),
                          },
                        };
                        fetchedPositions.push(keywordCoordinates);
                      } else {
                        console.warn(
                          `Failed to find a fallback for ${name} (${address}):`,
                          keywordStatus
                        );
                      }
                      resolve();
                    }
                  );
                }
              });
            });
          }
        }

        setPositions(fetchedPositions);
      } catch (error) {
        console.error("Error fetching itinerary from session storage:", error);
      }
    }

    fetchItineraryFromSessionStorage();
  }, []);

  return (
    <Map
      center={positions[0]?.latlng || { lat: 37.5665, lng: 126.978 }}
      style={{ width: "100%", height: "100%" }}
      level={9}
    >
      {/* PolylineComponent: 마커를 잇는 선 */}
      {positions.length > 1 && <PolylineComponent positions={positions} />}

      {/* MapMarker: 마커 표시 및 마우스 오버 시 인포텍스트 표시 */}
      {positions.map((position, index) => (
        <MapMarker
          key={`${position.title}-${index}`}
          position={position.latlng}
          image={{
            src: tamtam,
            size: {
              width: 24,
              height: 35,
            },
          }}
          title={position.title} // 마우스 오버 시 기본 툴팁
          onMouseOver={() => setInfoVisibleIndex(index)} // 마우스 오버 이벤트
          onMouseOut={() => setInfoVisibleIndex(null)} // 마우스 아웃 이벤트
        >
          {/* InfoWindow를 통해 마우스 오버 시 인포텍스트 표시 */}
          {infoVisibleIndex === index && <div>{position.title}</div>}
        </MapMarker>
      ))}
    </Map>
  );
}

export default KakaoMap;
