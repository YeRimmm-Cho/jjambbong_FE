import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import defaultImage from "../assets/images/jeju.png";

const GooglePlacesImageUpdater = forwardRef((_, ref) => {
  const [places, setPlaces] = useState([]); // 로컬 상태 관리

  const updateSessionStorageWithImages = async () => {
    const apiKey = process.env.REACT_APP_API_GOOGLE_KEY;

    try {
      const storedData = sessionStorage.getItem("places");
      if (!storedData) {
        console.error("No places found in sessionStorage.");
        return;
      }

      const parsedPlaces = JSON.parse(storedData);
      console.log("Parsed places:", parsedPlaces);

      const updatedPlaces = {};

      for (const dayKey in parsedPlaces) {
        const daySpots = Array.isArray(parsedPlaces[dayKey])
          ? parsedPlaces[dayKey]
          : []; // 배열 확인 및 기본값 처리

        updatedPlaces[dayKey] = await Promise.all(
          daySpots.map(async (spot) => {
            const { name, address } = spot;

            try {
              // 1. Google Places API에서 Place ID 검색
              const placeSearchResponse = await fetch(
                `/google-api/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
                  `${name} ${address}`
                )}&inputtype=textquery&fields=place_id&key=${apiKey}`
              );
              const placeSearchData = await placeSearchResponse.json();

              if (
                placeSearchData.status === "OK" &&
                placeSearchData.candidates.length > 0
              ) {
                const placeId = placeSearchData.candidates[0].place_id;

                // 2. Place ID를 사용해 Place Photo 가져오기
                const placeDetailsResponse = await fetch(
                  `/google-api/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`
                );
                const placeDetailsData = await placeDetailsResponse.json();

                if (
                  placeDetailsData.status === "OK" &&
                  placeDetailsData.result.photos &&
                  placeDetailsData.result.photos.length > 0
                ) {
                  const photoReference =
                    placeDetailsData.result.photos[0].photo_reference;
                  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

                  return {
                    ...spot,
                    imageUrl: photoUrl, // 성공적으로 가져온 이미지
                  };
                }
              }
            } catch (error) {
              console.error(`Error fetching data for ${name}:`, error);
            }

            // 실패 시 기본값 반환
            return {
              ...spot,
              imageUrl: defaultImage, // 기본 이미지 설정
            };
          })
        );
      }

      // 업데이트된 데이터 sessionStorage에 저장
      sessionStorage.setItem("places", JSON.stringify(updatedPlaces));
      setPlaces(updatedPlaces);
      console.log("Updated sessionStorage with images:", updatedPlaces);
    } catch (error) {
      console.error("Error updating places with images:", error);
    }
  };

  // 외부에서 이 함수 호출 가능
  useImperativeHandle(ref, () => ({
    updateSessionStorageWithImages,
  }));

  return null; // 렌더링 요소 없음
});

export default GooglePlacesImageUpdater;
