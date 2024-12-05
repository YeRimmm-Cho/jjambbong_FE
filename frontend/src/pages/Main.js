import React, { useEffect, useState } from "react";
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
    nickname: "", // 기본 닉네임
    profileImage: iconUserProfile, // 기본 이미지
  });

  // localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    const nickname = localStorage.getItem("nickname") || "로그인이 필요합니다"; // 닉네임 가져오기
    setUserInfo({
      nickname, // 닉네임 유지
      profileImage: iconUserProfile, // 항상 기본 이미지 사용
    });
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };
  const isLoggedIn = !!localStorage.getItem("token");
  const [players, setPlayers] = useState([]); // YouTube player 객체 관리

  const handleProfileClick = () => {
    if (!userInfo.nickname) {
      navigate("login"); // 닉네임이 없으면 로그인 페이지로 이동
    } else {
      navigate("/mypage"); // 닉네임이 있으면 마이페이지로 이동
    }
  };

  const handleLogout = () => {
    // 로컬스토리지 초기화 및 페이지 이동
    localStorage.clear();
    sessionStorage.clear(); // 세션스토리지 초기화
    setUserInfo({ nickname: "", profileImage: iconUserProfile });
    setPlayers([]); // YouTube player 객체 정리
    navigate("/login");
  };

  const option = {
    height: "270", // 높이
    width: "480", // 너비
    playerVars: {
      autoplay: 0,
      mute: 1,
    },
  };

  const handlePlayerReady = (event) => {
    setPlayers((prev) => [...prev, event.target]); // YouTube player 객체 저장
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 플레이어 정리
    return () => {
      players.forEach((player) => {
        try {
          player.destroy();
        } catch (err) {
          console.error("Failed to destroy player:", err);
        }
      });
    };
  }, [players]);

  return (
    <div className={styles.screen}>
      <div className={styles.Header}>
        <div className={styles.logoContainer} onClick={handleLogoClick}>
          <Logo className={styles.logo} />
          <h2 className={styles.logotitle}>탐라, 탐나</h2>
        </div>
        <div
          className={styles.profileContainer}
          onClick={handleProfileClick} // 프로필 클릭 시 이동
        >
          <img
            src={userInfo.profileImage || iconUserProfile}
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

      {/* YouTube 동영상 */}
      <div className={styles.youtubeContainer}>
        <YouTube
          videoId="ZVmmP0CgpUg" // YouTube 동영상 ID
          opts={option}
          className={styles.youtube}
        />
        <YouTube
          videoId="S39KiBTpIaM" // YouTube 동영상 ID
          opts={option}
          className={styles.youtube}
        />
        <YouTube
          videoId="M87B-PM2JNs" // YouTube 동영상 ID
          opts={option}
          className={styles.youtube}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Main;
