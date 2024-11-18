import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Kakaoauth = () => {
    const code = window.location.search; // 인가 코드 추출
    const PARAMS = new URL(document.location).searchParams;
    const KAKAO_CODE = PARAMS.get("code");
    const navigate = useNavigate();

  useEffect(() => {
    axios
        .post(`http://your-backend-url.com/kakaoLogin${KAKAO_CODE}`)
        .then((response) => {
            const { user_name, profile_image } = response.data; // 필요한 데이터 추출

        // 닉네임과 프로필 사진을 로컬 스토리지에 저장
        localStorage.setItem('nickname', user_name);
        localStorage.setItem('profile_image', profile_image);

        // 메인 페이지로 이동
        navigate('/');
      })
      .catch((error) => {
        console.error('카카오 로그인 실패:', error);
      });
  }, [code, navigate]);

  return <div>로그인 중입니다...
    {console.log(KAKAO_CODE)}
  </div>;
};

export default Kakaoauth;