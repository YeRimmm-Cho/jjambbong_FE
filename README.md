# 2024-2-SCS4031-jjambbong-3

---

융합캡스톤디자인 짬뽕(S3)의 레파지토리입니다.


## 팀원

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
<br>

## LLM 기반 제주도 여행 계획 추천 서비스 - "탐라, 탐나"

---
### 개요
- LLM과 RAG를 결하여 제주도를 여행하는 사용자들이 개인의 취향과 필요에 맞춘 여행 계획을 쉽게 세우고 실행할 수 있도록 돕는 플랫폼 개발<br><br>

### 개발목표
- 사용자 중심의 맞춤형 여행 일정 추천 서비스 제공
- 여행 일정 관리의 편의성 제공
- 최신 데이터와 LLM의 결합으로 신뢰도 강화<br><br>

### 주요 기능
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


