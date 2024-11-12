import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage({title, askChange, changePage, page}) {

    const[id, setId] = useState('');
    const[pw,setPw] = useState('');
    const handleLogin = () => {
        alert(`아이디: ${id}, 비밀번호: ${pw}`);
    }
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(page); 
      };
    return (
        <div className={styles.background}>
            <div className={styles.loginContainer}>
                <div className={styles.header}>
                    <div className={styles.headerInner}>
                        <p> AI 여행 플래너 탐라, 탐나 </p> 
                        <h1 className={styles.nomargin}> {title} </h1>
                    </div>
                    <div className={styles.headerInner}>
                        <p> {askChange} </p>
                        <span 
                            className={styles.textColor}
                            onClick={handleNavigate} 
                        > {changePage}</span>
                    </div>
                </div>
                <body>
                    <form>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}> 아이디 </label>
                            <input 
                                className={styles.inputBox}
                                type="text"
                                placeholder="아이디를 입력해주세요."
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}> 비밀번호 </label>
                            <input 
                                className={styles.inputBox}
                                type="password"    
                                placeholder="비밀번호를 입력해주세요." 
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                />    
                        </div>
                        <div className={styles.inputContainer}>  
                            <button type="submit" 
                                className={styles.loginButton}
                                onClick={handleLogin}
                            > 
                            {title}
                            </button>
                            <button type="submit" className={styles.kakaoButton}>
                                <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="kakao" className={styles.kakaoIcon}/>
                                <span>카카오로 {title}하기</span>
                            </button>                            
                        </div>
                    </form>
                </body>
            </div>
        </div>
    );
}

export default LoginPage;