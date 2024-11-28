import axios from "axios";

// 환경 변수에서 Base URL 가져오기
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);

// Greeting API
export const getGreetingMessage = async (frontInput) => {
  try {
    const url = `${API_BASE_URL}/greeting`;
    console.log("Request URL:", url); // 디버깅용
    const response = await axios.post(url, { front_input: frontInput });
    return response.data.response;
  } catch (error) {
    console.error("Greeting API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Plan API
export const getTravelPlan = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/plan`, requestData);
    return response.data;
  } catch (error) {
    console.error("Plan API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Modify API
export const modifyTravelPlan = async (modifyRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/modify`, {
      modify_request: modifyRequest,
    });
    return response.data;
  } catch (error) {
    console.error("Modify API Error:", error.response?.data || error.message);
    throw error;
  }
};
