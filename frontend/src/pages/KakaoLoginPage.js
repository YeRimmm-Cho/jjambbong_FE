import React from 'react';
import styles from './KakaoLoginPage.module.css';
import tamtam from '../assets/images/tamtam.svg'
import kakaoIcon from '../assets/images/kakao_logo.svg'
import Footer from '../components/Footer';

function KakaoLoginPage() {
    const Rest_api_key='19bd1cef6d04beb937c1f7a84130fc11' //REST API KEY
    const redirect_uri = 'http://localhost:3000/kakaoauth' //Redirect URI
    // oauth 요청 URL
    const url  = 'http://localhost:8080/login/oauth2/code/kakao'
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const kakaoLogin = ()=>{
        window.location.href = kakaoURL
    }
    const onClick =() =>{
        window.location.href = url
    }
    return(
       <div className = {styles.background}>
            <div className = {styles.title}>
                <span>탐라,탐나</span>
                <img src = {tamtam} alt="tamtam" className = {styles.img}></img>
            </div>    
        <div className = {styles.screen}>
            <span className = {styles.description}> 간편하게 로그인하고 <br/>다양한 서비스를 이용해보세요</span>
            <span className={styles.kakaoLoginButton}
            onClick={onClick}
            >
            <img src = {kakaoIcon} alt="kakaoIcon" className = {styles.kakaoIcon}></img>
            <span className = {styles.kakaoText}
            >
            카카오 로그인
            </span>
            </span>
        </div>
        <Footer/>
       </div>
    )
}

export default KakaoLoginPage;