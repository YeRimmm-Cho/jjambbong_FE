import React from "react";
import './WithWhom.module.css'

function WithWhom() {
    const buttonLabels = ['친구와', '연인과', '부모님과', '아이와', '혼자'];

    return (
      <div className="with-whom">
        {buttonLabels.map((label, index) => (
          <button key={index} className="button-style">
            {label} {/* 각 버튼에 배열의 텍스트를 표시 */}
          </button>
        ))}
      </div>
    );
  }

export default WithWhom;