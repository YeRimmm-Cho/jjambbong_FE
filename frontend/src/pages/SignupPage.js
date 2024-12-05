import React, { useState } from "react";
import { signup } from "../api/userApi";
import styles from "./SignupPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import airplaneImage from "../assets/icon_airplane.png"; // 배경 비행기 이미지

function SignupPage() {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const isFormValid =
    formData.nickname &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(""); // 에러 메시지 초기화
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { nickname, email, password, confirmPassword } = formData;

    try {
      const response = await signup(email, nickname, password, confirmPassword);
      alert(`${response.message || "회원가입 성공!"}`);
      window.location.href = "/login"; // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "회원가입 실패");
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.backgroundContainer}>
        <img
          src={airplaneImage}
          alt="비행기 배경"
          className={styles.backgroundAirplane}
        />
      </div>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <Logo className={styles.logo} />
        <h2 className={styles.logoTitle}>탐라, 탐나</h2>
      </div>
      <div className={styles.signupContainer}>
        <h1>회원가입</h1>
        <p>AI 여행 플래너 탐라, 탐나</p>

        <form onSubmit={handleSignup} className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="닉네임을 입력해주세요"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button
            type="submit"
            className={styles.signupBtn}
            disabled={!isFormValid}
          >
            회원가입
          </button>
        </form>

        <p className={styles.loginLink}>
          계정이 있으신가요?{" "}
          <a href="/login" className={styles.loginLinkText}>
            로그인 하기
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
