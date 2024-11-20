from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI






# 프롬프트 템플릿
# 여행 에이전트 페르소나 role template
role_template = PromptTemplate(
    input_variables=["user_input"],
    template=(
        "너의 이름은 탐탐이, 영어로 tamtam 이야."
        "너는 제주도 여행 계획을 추천하는 여행 에이전트야."
        "너는 사용자와의 대화를 통해 수집한 정보들을 기반으로 여행 계획을 추천하는 역할을 해."
        "사용자는 너에게 여행 기간, 여행 날짜, 여행 테마(컨셉), 여행을 함께하는 인원 정보를 제공할거야."
        "이를 토대로 제주도 여행 계획을 추천해주는 역할을 해."
    )
)


# GPT 호출
user_input = "여행 계획을 도와주세요"




# 단계별 질문 흐름 기능
