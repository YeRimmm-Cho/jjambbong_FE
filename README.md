# 🍊당신의 제주도 여행을 탐라, 탐나와 함께.

---

![Group 64746](https://github.com/user-attachments/assets/c1597f72-1208-46fd-aca1-7857fe7dbd13)



## 목차

---

[1. 팀원](#팀원)<br>
[2. 프로젝트 개요](#프로젝트-개요)<br>
[3. 프로젝트 구조](#프로젝트-구조)<br>
[4. 기술 스택](#기술-스택)<br>




## 🍊팀원

---
|<img src="https://avatars.githubusercontent.com/u/144208568?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/155754445?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/162420581?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/144078388?v=4" width="150" height="150"/>|
|:-:|:-:|:-:|:-:|
|김수현[@SuHyunKKim](https://github.com/SuHyunKKim) |서가은[@gaaaani](https://github.com/gaaaani)|이현종[@HyunJong00](https://github.com/HyunJong00)|조예림[@YeRimmm-Cho](https://github.com/YeRimmm-Cho)|
|백엔드 |백엔드 |프론트엔드 |프론트엔드 |

<br>

구분 | 성명 | 학번 | 소속학과 | 연계전공
------|-------|-------|-------|-------
팀장 | 김수현 | 2019112426 | 산업시스템공학과 | 융합소프트웨어
팀원 | 서가은 | 2021110261 | 통계학과 | 융합소프트웨어      
팀원 | 이현종 | 2019111655 | 바이오환경과학과 | 융합소프트웨어 
팀원 | 조예림 | 2020111500 | 회계학과 | 융합소프트웨어 
<div align="right">

[목차로](#목차)

</div>
<br>




## 🍊LLM 기반 제주도 여행 계획 추천 서비스 - "탐라, 탐나"🍊

---
### 🍊개요
- LLM과 RAG를 결하여 제주도를 여행하는 사용자들이 개인의 취향과 필요에 맞춘 여행 계획을 쉽게 세우고 실행할 수 있도록 돕는 플랫폼 개발<br><br>

### 🍊개발목표
- 사용자 중심의 맞춤형 여행 일정 추천 서비스 제공
- 여행 일정 관리의 편의성 제공
- 최신 데이터와 LLM의 결합으로 신뢰도 강화<br><br>

### 🍊주요 기능
- **사용자 맞춤형 여행 추천**
  - 사용자가 입력한 여행 정보(여행 기간, 동반자, 선호 테마 등)를 바탕으로 페르소나가 부여된 LLM이 여행 일정을 추천
  - 실시간 대화형 인터페이스를 통해 추천받은 일정 수정 및 상호작용 가능<br><br>
  
- **RAG(Retrieval-Augmented Generation) 기반 장소 데이터 활용**
  - 크롤링한 데이터를 기반으로 한 최신 장소 정보 제공
  - RAG 기술을 사용하여 데이터베이스에서 관련 정보를 검색하고 LLM이 자연어로 여행 일정 생성<br><br>
  
- **세부 일정 및 경로 생성**
  - 추천된 여행지에 경로 제공<br><br>

- **여행 일정 저장 및 관리**
  - 생성된 여행 일정을 사용자가 저장할 수 있는 기능 지원
  - 저장된 일정을 사용자가 언제든 다시 확인 가능

<br>

## 프로젝트 구조

---

```
2024-2-SCS4031-jjambbong-3
├── .github
├── .idea
├── .vscode
├── frontend
├── server
│   ├── src
│   │   ├── main
│   │   │   ├── java.com.capstone.server
│   │   │   │ 
│   │   │   ├── python
│   │   │   │   ├── app.py
│   │   │   ├── resources
├── PinecornDB
├── venv
├── README.md
├── requirements.txt
├── .env

```
<div align="right">

[목차로](#목차)

</div>



## 기술 스택

---
<div style="display:flex; flex-direction:column; align-items:flex-start;">
    <!-- Frontend -->
    <p><strong>Frontend</strong></p>
    <div>
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
      <img src="https://img.shields.io/badge/CSS Modules-000000?style=for-the-badge&logo=css3&logoColor=white">
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
      <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
      <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
      <img src="https://img.shields.io/badge/react_router-CA4245?style=for-the-badge&logo=react-router&logoColor=white">
      <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
    </div>
    <!-- Backend -->
    <p><strong>Backend</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white">
      <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white">
      <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
      <img src="https://img.shields.io/badge/venv-4CAF50?style=for-the-badge&logo=python&logoColor=white">
      <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white">
      <img src="https://img.shields.io/badge/Pinecone-0093E9?style=for-the-badge&logoColor=white">
      <img src="https://img.shields.io/badge/Java-000000?style=for-the-badge&logo=openjdk&logoColor=white">
    </div>
    <!-- Server -->
    <p><strong>Server</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
      <img src="https://img.shields.io/badge/Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white">
      <img src="https://img.shields.io/badge/aws ec2-FF9900?style=for-the-badge&logo=amazon ec2&logoColor=white">
      <img src="https://img.shields.io/badge/aws route53-8C4FFF?style=for-the-badge&logo=amazonroute53&logoColor=white">
      <img src="https://img.shields.io/badge/AWS ELB-8C4FFF?style=for-the-badge&logo=awselasticloadbalancing&logoColor=white">
      <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white">
    </div>
    <!-- Database -->
    <p><strong>Database</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
      <img src="https://img.shields.io/badge/MySQL Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
    </div>
    <!-- Development Tools -->
    <p><strong>Development Tools</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Visual Studio Code-0078d7?style=for-the-badge&logo=visual studio code&logoColor=white">
      <img src="https://img.shields.io/badge/IntelliJ IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white">
      <img src="https://img.shields.io/badge/google colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white">
    </div>
    <!-- Communications -->
    <p><strong>Communications</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
      <img src="https://img.shields.io/badge/Google Meet-34A853?style=for-the-badge&logo=google-meet&logoColor=white">
      <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">
      <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white">
    </div>
    <!-- Communications -->
    <p><strong>Collaborations</strong></p>
    <div>
      <img src="https://img.shields.io/badge/KakaoMap API-FFCD00?style=for-the-badge&logo=kakao&logoColor=black">
      <img src="https://img.shields.io/badge/Google Maps API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white">
      <img src="https://img.shields.io/badge/Google Image-4285F4?style=for-the-badge&logo=google&logoColor=white">
    </div>
    <!-- Version Control -->
    <p><strong>Version Control</strong></p>
    <div>
      <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
    </div>
</div>

<div align="right">

[목차로](#목차)

</div>


## 참고자료

---

[노션 회의록 바로가기](https://meadow-cast-ab6.notion.site/819004d3d6a94c39b9271febe71a94ee?pvs=4)


