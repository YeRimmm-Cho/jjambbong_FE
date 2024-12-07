import React, { useState } from "react";
import styles from "./WithWhom.module.css";

function WithWhom({ onCompanionSelect, disabled }) {
  const buttonLabels = ["친구와", "연인과", "부모님과", "아이와", "혼자"];
  const [activeIndex, setActiveIndex] = useState(null);

  const handleButtonClick = (index) => {
    if (disabled) return; // 비활성화 상태에서는 클릭 이벤트 실행 안 됨

    setActiveIndex(index);
    const selectedLabel = buttonLabels[index];
    onCompanionSelect(selectedLabel); // 선택된 버튼 내용을 부모 컴포넌트로 전달
  };

  return (
    <div className={styles.withWhom}>
      {buttonLabels.map((label, index) => (
        <button
          key={index}
          className={styles.buttonStyle}
          onClick={() => handleButtonClick(index)}
          disabled={disabled}
          style={{
            backgroundColor: activeIndex === index ? "#FFA94F" : "white",
            color: activeIndex === index ? "white" : "#333",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default WithWhom;
