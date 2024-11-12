import { useState } from 'react';
import Calendar from '../components/Calendar';
import './ChatPage.css';
import WithWhom from '../components/WithWhom';

function ChatPage() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCompanion, setSelectedCompanion] = useState(null); 

  const handleCompanionSelect = (companion) => {
    setSelectedCompanion(companion);
  };

  const isDateRangeSelected = dateRange[0] && dateRange[1]; // dateRange의 값이 모두 설정되었는지 확인

  return (
    <div className="screen">
      <div className="question-style">
        <div className="calendar-style">
          <Calendar dateRange={dateRange} onChange={setDateRange} />
          <span className="llm-message"> 언제 여행을 떠나시나요? </span>
        </div>
        <span className="client-message">
          {dateRange[0] ? dateRange[0].toLocaleDateString() : null} 
          {dateRange[1] && dateRange[0] !== dateRange[1] ? ` ~ ${dateRange[1].toLocaleDateString()}` : ''}
        </span>
      </div>
      
      {isDateRangeSelected && ( // dateRange가 설정되었을 때만 렌더링
        <div className="question-style">
          <div>
            <span className="llm-message"> 누구와 함께 여행을 떠나시나요? </span>
            <WithWhom onCompanionSelect={handleCompanionSelect} />
          </div>
          {selectedCompanion && ( // selectedCompanion이 null이 아닐 때만 표시
            <span className="client-message">
              {selectedCompanion}
            </span>
          )}
        </div> 
      )}
    </div>
  );
}

export default ChatPage;