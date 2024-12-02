import React, { useState } from "react";
import styles from "./Thema.module.css";

function Thema({ onSelectionChange, disabled }) {
  // 함수명도 좀 더 일반적인 이름으로 변경
  const options = ["액티비티", "자연+힐링", "맛집", "문화/예술/역사", "쇼핑"];
  const [selectedIndexes, setSelectedIndexes] = useState([]); // 선택된 인덱스를 저장하는 배열

  const handleButtonClick = (index) => {
    if (disabled) return; // 비활성화 상태에서 클릭 이벤트 차단

    const selectedOption = options[index];
    let updatedIndexes;

    if (selectedIndexes.includes(index)) {
      // 이미 선택된 경우 배열에서 해당 인덱스를 제거
      updatedIndexes = selectedIndexes.filter((i) => i !== index);
    } else {
      // 선택되지 않은 경우 배열에 해당 인덱스를 추가
      updatedIndexes = [...selectedIndexes, index];
    }

    setSelectedIndexes(updatedIndexes);

    // 선택된 옵션들을 부모 컴포넌트로 전달
    const selectedOptions = updatedIndexes.map((i) => options[i]);
    onSelectionChange(selectedOptions);
  };

  return (
    <div className={styles.thema}>
      {options.map((label, index) => (
        <button
          key={index}
          className={styles.buttonStyle}
          onClick={() => handleButtonClick(index)}
          disabled={disabled}
          style={{
            backgroundColor: selectedIndexes.includes(index)
              ? "#FFA94F"
              : "white",
            color: selectedIndexes.includes(index) ? "white" : "#333",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Thema;
