import React, { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import styles from "./Main.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import iconUserProfile from "../assets/icon_userprofile.png";

function Main() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    profileImage: iconUserProfile,
  });
  const playersRef = useRef([]); // YouTube player 객체를 관리하는 ref

  // 사용자 정보 로드
  useEffect(() => {
    const nickname = localStorage.getItem("nickname") || "로그인이 필요합니다";
    const profileImage =
      localStorage.getItem("profileImage") || iconUserProfile;

    setUserInfo({ nickname, profileImage });
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const handleProfileClick = () => {
    navigate(isLoggedIn ? "/mypage" : "/login");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserInfo({ nickname: "", profileImage: iconUserProfile });
    playersRef.current = []; // YouTube player 객체 초기화
    navigate("/login");
  };

  const option = {
    height: "270",
    width: "480",
    playerVars: {
      autoplay: 0,
      mute: 1,
    },
  };

  const handlePlayerReady = (event) => {
    const player = event.target;
    if (!playersRef.current.includes(player)) {
      playersRef.current.push(player); // 중복 추가 방지
    }
  };

  const handlePlayerError = (event) => {
    console.error("YouTube player error:", event.data);
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 모든 플레이어 제거
      playersRef.current.forEach((player) => {
        if (player && typeof player.destroy === "function") {
          try {
            player.destroy();
          } catch (err) {
            console.error("Failed to destroy player:", err);
          }
        }
      });
      playersRef.current = []; // 참조 초기화
    };
  }, []);

  return (
    <div className={styles.screen}>
      {/* Header Section */}
      <div className={styles.Header}>
        <div className={styles.logoContainer} onClick={handleLogoClick}>
          <Logo className={styles.logo} />
          <h2 className={styles.logotitle}>탐라, 탐나</h2>
        </div>
        <div className={styles.profileContainer} onClick={handleProfileClick}>
          <img
            src={userInfo.profileImage}
            alt="User Profile"
            className={styles.profileImage}
            onError={(e) => {
              e.target.src = iconUserProfile; // 로드 실패 시 기본 이미지로 대체
            }}
          />
          <span className={styles.profileName}>
            {userInfo.nickname || "로그인이 필요합니다"}
          </span>
        </div>
      </div>

      {/* Main Buttons Section */}
      <div className={styles.mainButtons}>
        <Link to="/new" className={styles.button}>
          여행 일정 생성하기
        </Link>
        <Link to="/mypage" className={styles.button}>
          마이페이지
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" className={styles.button}>
            로그인하기
          </Link>
        ) : (
          <button className={styles.button} onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </div>

      {/* YouTube Player Section */}
      <div className={styles.youtubeContainer}>
        <YouTube
          videoId="ZVmmP0CgpUg"
          opts={option}
          className={styles.youtube}
          onReady={handlePlayerReady}
          onError={handlePlayerError}
        />
        <YouTube
          videoId="S39KiBTpIaM"
          opts={option}
          className={styles.youtube}
          onReady={handlePlayerReady}
          onError={handlePlayerError}
        />
        <YouTube
          videoId="M87B-PM2JNs"
          opts={option}
          className={styles.youtube}
          onReady={handlePlayerReady}
          onError={handlePlayerError}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Main;
