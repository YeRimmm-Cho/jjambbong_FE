import React, { useEffect, useState } from "react";

const GooglePlacesUpdater = () => {
  const [places, setPlaces] = useState([]);

  const updateLocalStorageWithImages = async () => {
    const apiKey = process.env.REACT_APP_API_GOOGLE_KEY;

    try {
      // 1. localStorage에서 places 데이터 가져오기
      const storedData = localStorage.getItem("places");
      if (!storedData) {
        console.error("No places found in localStorage.");
        return;
      }

      const parsedPlaces = JSON.parse(storedData);

      const updatedPlaces = {};

      for (const dayKey in parsedPlaces) {
        const daySpots = parsedPlaces[dayKey];
        updatedPlaces[dayKey] = await Promise.all(
          daySpots.map(async (spot) => {
            const { name, address } = spot;

            // 2. Google Places API: findplacefromtext 호출
            const placeSearchResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
                `${name} ${address}`
              )}&inputtype=textquery&fields=place_id&key=${apiKey}`
            );
            const placeSearchData = await placeSearchResponse.json();

            if (
              placeSearchData.status === "OK" &&
              placeSearchData.candidates.length > 0
            ) {
              const placeId = placeSearchData.candidates[0].place_id;

              // 3. Google Places API: place details 호출
              const placeDetailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`
              );
              const placeDetailsData = await placeDetailsResponse.json();

              if (
                placeDetailsData.status === "OK" &&
                placeDetailsData.result.photos &&
                placeDetailsData.result.photos.length > 0
              ) {
                const photoReference =
                  placeDetailsData.result.photos[0].photo_reference;

                // 4. Google Places API: photo 호출 (URL 생성)
                const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

                // 이미지 URL 추가하여 반환
                return {
                  ...spot,
                  imageUrl: photoUrl,
                };
              }
            }

            // 기본 데이터 반환 (이미지가 없는 경우)
            return {
              ...spot,
              imageUrl: null,
            };
          })
        );
      }

      // 5. localStorage에 업데이트된 데이터 저장
      localStorage.setItem("places", JSON.stringify(updatedPlaces));

      // React 상태도 업데이트
      setPlaces(updatedPlaces);

      console.log("LocalStorage updated with images!");
    } catch (error) {
      console.error("Error updating places with images:", error);
    }
  };

  useEffect(() => {
    // 처음 로드 시 업데이트 로직 실행
    updateLocalStorageWithImages();
  }, []);

  return (
    <div>
      <h1>Google Places Image Updater</h1>
      {places &&
        Object.keys(places).map((dayKey) => (
          <div key={dayKey}>
            <h2>{dayKey}</h2>
            {places[dayKey].map((spot, index) => (
              <div key={index}>
                <p>Name: {spot.name}</p>
                <p>Address: {spot.address}</p>
                {spot.imageUrl ? (
                  <img src={spot.imageUrl} alt={spot.name} width="200" />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default GooglePlacesUpdater;
