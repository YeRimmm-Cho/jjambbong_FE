import React from 'react';
import LoginPage from './LoginPage';

function JoinPage({title, askChange, changePage}) {
    return(
        <LoginPage title='회원가입' askChange='이미 계정이 있으신가요?' changePage='로그인 하기' page='/login'/>
    )
}

export default JoinPage;