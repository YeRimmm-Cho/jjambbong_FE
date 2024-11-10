import { useState } from 'react';
import Calendar from '../components/Calendar';
import './ChatPage.css';
import WithWhom from '../components/WithWhom';

function ChatPage() {
  const [dateRange, setDateRange] = useState([null, null]);

  return (
    <div className="screen">
      <div className = "calendar">
        <div className = "calendar-style">
            <Calendar dateRange={dateRange} onChange={setDateRange} />
            <span className="llm-message"> 언제 여행을 떠나시나요? </span>
        </div>
        <span className = "client-message">
            {dateRange[0] ? dateRange[0].toLocaleDateString() : null} 
            {dateRange[1] && dateRange[0] !== dateRange[1] ? ` ~ ${dateRange[1].toLocaleDateString()}` : ''}
         </span>
      </div>
         <div className = 'with'>
            <div>
            <span className="llm-message"> 누구와 함께 가시나요? </span>
            <WithWhom />
            </div>
            <span className="client-message"> 친구와 </span>
         </div>
        
     </div>
  );
}

export default ChatPage;