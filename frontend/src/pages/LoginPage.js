import React, { useState } from "react";
import { login } from "../api/userApi";
import styles from "./LoginPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import airplaneImage from "../assets/icon_airplane.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      alert(`${response.user.nickname}님, 환영합니다!`);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "로그인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errorMessage) setErrorMessage("");
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.loginPage}>
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
      <div className={styles.loginContainer}>
        <h1>로그인</h1>
        <p>AI 여행 플래너 탐라, 탐나</p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">아이디</label>
            <input
              type="email"
              id="email"
              placeholder="아이디를 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className={styles.signupLink}>
          계정이 없으신가요?{" "}
          <Link to="/signup" className={styles.signupLinkText}>
            회원가입 하기
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
