import React, { useState } from "react";
import styles from "./InputModal.module.css";
import { ReactComponent as CloseIcon } from "../assets/icon_x.svg"; // X 아이콘 임포트

function InputModal({ title, description, placeholder, onClose, onConfirm }) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue.trim() === "") {
      alert(`${placeholder}을(를) 입력하세요.`);
      return;
    }
    onConfirm(inputValue); // 부모 컴포넌트로 값 전달
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>{" "}
          {/* 동적으로 제목 변경 */}
          <CloseIcon onClick={onClose} className={styles.closeIcon} />
        </div>
        <p className={styles.modalDescription}>{description}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={styles.inputField}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleConfirm} className={styles.deleteButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputModal;
