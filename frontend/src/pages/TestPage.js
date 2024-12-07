import React, { useRef } from "react";
import GooglePlacesImageUpdater from "../api/GooglePlacesImageFetcher";

const PlacesPage = () => {
  const updaterRef = useRef();

  const handleUpdateImages = () => {
    if (updaterRef.current) {
      updaterRef.current.updateSessionStorageWithImages();
    }
  };

  return (
    <div>
      <h1>Places and Images</h1>
      <button onClick={handleUpdateImages}>Update Images</button>
      <GooglePlacesImageUpdater ref={updaterRef} />
    </div>
  );
};

export default PlacesPage;
