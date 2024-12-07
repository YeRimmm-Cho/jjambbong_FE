import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_USER_URL;

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰 추가
    }
    return config;
  },
  (error) => Promise.reject(error) // 요청 오류 처리
);

// 응답 인터셉터: 인증 만료 처리
apiClient.interceptors.response.use(
  (response) => response, // 성공적인 응답 반환
  (error) => {
    if (error.response?.status === 401) {
      // 401 인증 오류 처리
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token"); // 저장된 토큰 제거
      window.location.href = "/login"; // 로그인 페이지로 이동
    }
    return Promise.reject(error); // 오류 전달
  }
);

export default apiClient;
