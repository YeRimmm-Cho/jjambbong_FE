import apiClient from "./apiClient";

// Signup API (회원가입)
export const signup = async (email, nickname, password, confirmPassword) => {
  try {
    const response = await apiClient.post("/auth/signup", {
      email,
      nickname,
      password,
      confirmPassword,
    });
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("Signup API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login API (로그인)
export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    // 로컬스토리지에 토큰과 사용자 정보 저장
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("nickname", user.nickname);

    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout");
    return response.data; // 로그아웃 응답 데이터 반환
  } catch (error) {
    console.error("Logout API Error:", error.response?.data || error.message);
    throw error;
  }
};
