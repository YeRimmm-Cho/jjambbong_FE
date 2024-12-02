import axios from "axios";

// 환경 변수에서 Base URL 가져오기
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 여행 일정 저장 API 호출 함수
 * @param {string} userId 사용자 ID
 * @param {string} travelName 여행 일정 제목
 * @returns {Promise<Object>} API 응답 객체
 */

// saveplan API (여행 계획 저장)
export const saveTravelPlan = async (userId, travelName) => {
  try {
    const url = `${API_BASE_URL}/saveplan`; // API 엔드포인트
    const response = await axios.post(url, {
      user_id: userId,
      travel_name: travelName,
    });
    console.log("Response Data:", response.data); // 디버깅용
    return response.data; // { message: "여행 계획 저장 성공!" }
  } catch (error) {
    console.error(
      "Save Travel Plan API Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "여행 계획 저장에 실패했습니다."
    );
  }
};

/**
 * 마이페이지 여행 계획 불러오기 API 호출 함수
 * @param {string} userId 사용자 ID
 * @returns {Promise<Object>} API 응답 객체
 */

// loadplan API
export const loadTravelPlans = async (userId) => {
  try {
    const url = `${API_BASE_URL}/loadplan_mypage`; // API 엔드포인트
    const response = await axios.post(url, {
      user_id: userId,
    });
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Load Travel Plans API Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "여행 계획 불러오기에 실패했습니다."
    );
  }
};

/**
 * 상세 일정 페이지 여행 계획 불러오기 API 호출 함수
 * @param {string} userId 사용자 ID
 * @param {string} travelName 여행 일정 제목
 * @returns {Promise<Object>} API 응답 객체
 */

// loaddetailplan API
export const loadDetailedPlan = async (userId, travelName) => {
  try {
    const url = `${API_BASE_URL}/loadplan`; // API 엔드포인트
    const response = await axios.post(url, {
      user_id: userId,
      travel_name: travelName,
    });
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Load Detailed Plan API Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "상세 여행 계획 불러오기에 실패했습니다."
    );
  }
};
