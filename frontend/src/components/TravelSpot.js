import React from "react";
import styles from "./TravelSpot.module.css";

function TravelSpot({ spotData }) {
  const { imageUrl, name, category, address } = spotData;

  console.log("TravelSpot spotData:", spotData); // 디버깅용 데이터 확인

  return (
    <div className={styles.spotContainer}>
      {/* 이미지 표시 */}
      <img
        src={imageUrl || "https://via.placeholder.com/150"} // 이미지가 없으면 기본 이미지
        alt={name || "Travel Spot"} // 대체 텍스트
        className={styles.image}
      />

      {/* 장소 설명 */}
      <div className={styles.description}>
        <span className={styles.name}>{name || "Unknown Spot"}</span>
        <span className={styles.category}>
          {category || "Category Unavailable"}
        </span>
        <span className={styles.address}>
          {address || "Address Unavailable"}
        </span>
      </div>
    </div>
  );
}

export default TravelSpot;
