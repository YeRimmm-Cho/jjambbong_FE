import React from 'react';
import styles from './KakaoLoginPage.module.css';
import tamtam from '../assets/images/tamtam.svg'
import kakaoIcon from '../assets/images/kakao_logo.svg'
import Footer from '../components/Footer';

function KakaoLoginPage() {
    const kakaoLogin = () => {console.log("카카오 로그인 버튼 클릭")};  // 카카오 버튼 클릭시 실행 동작 
    return(
       <div className = {styles.background}>
            <div className = {styles.title}>
                <span>탐라,탐나</span>
                <img src = {tamtam} alt="tamtam" className = {styles.img}></img>
            </div>    
        <div className = {styles.screen}>
            <span className = {styles.description}> 간편하게 로그인하고 <br/>다양한 서비스를 이용해보세요</span>
            <span className={styles.kakaoLoginButton}
            onClick={kakaoLogin}
            >
            <img src = {kakaoIcon} alt="kakaoIcon" className = {styles.kakaoIcon}></img>
            <span className = {styles.kakaoText}>
            카카오 로그인
            </span>
            </span>
        </div>
        <Footer/>
       </div>
    )
}

export default KakaoLoginPage;