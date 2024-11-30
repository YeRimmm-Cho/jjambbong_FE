import React from "react";
import styles from "./TravelSpot.module.css";

function TravelSpot({ spotData }) {
  const { imageUrl, name, category, address } = spotData;

  console.log("TravelSpot spotData:", spotData); // 디버깅용 데이터 확인

  return (
    <div className={styles.spotContainer}>
      <img
        src={imageUrl || "https://via.placeholder.com/150"} // 이미지가 없으면 기본 이미지
        alt={name}
        className={styles.image}
      />
      <div className={styles.description}>
        <span className={styles.name}>{name}</span>
        <span className={styles.category}>{category}</span>
        <span className={styles.address}>{address}</span>
      </div>
    </div>
  );
}

export default TravelSpot;
