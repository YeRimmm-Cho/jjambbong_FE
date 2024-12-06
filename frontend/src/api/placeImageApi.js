import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const GooglePlacesImageUpdater = forwardRef((_, ref) => {
  const [places, setPlaces] = useState([]);

  const updateSessionStorageWithImages = async () => {
    const apiKey = process.env.REACT_APP_API_GOOGLE_KEY;

    try {
      const storedData = sessionStorage.getItem("places");
      if (!storedData) {
        console.error("No places found in sessionStorage.");
        return;
      }

      const parsedPlaces = JSON.parse(storedData);
      const updatedPlaces = {};

      for (const dayKey in parsedPlaces) {
        const daySpots = parsedPlaces[dayKey];
        updatedPlaces[dayKey] = await Promise.all(
          daySpots.map(async (spot) => {
            const { name, address } = spot;
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
                  imageUrl: photoUrl,
                };
              }
            }

            return {
              ...spot,
              imageUrl: null,
            };
          })
        );
      }

      sessionStorage.setItem("places", JSON.stringify(updatedPlaces));
      setPlaces(updatedPlaces);
      console.log("Updated sessionStorage with images:", updatedPlaces);
    } catch (error) {
      console.error("Error updating places with images:", error);
    }
  };

  // 외부에서 호출할 수 있도록 메서드 제공
  useImperativeHandle(ref, () => ({
    updateSessionStorageWithImages,
  }));

  return null; // 렌더링 필요 없음
});

export default GooglePlacesImageUpdater;
