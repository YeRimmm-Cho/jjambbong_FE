from flask import Flask, request, jsonify, session
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_community.llms import OpenAI
from langchain.chains import LLMChain
from pinecone import Pinecone
import openai

from dotenv import load_dotenv
import os

# OpenAI API 키 불러오기
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
secret_key = os.getenv("SECRET_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")

# Flask 앱 설정
app = Flask(__name__)
CORS(app) # CORS 설정
app.secret_key = secret_key # 세션 키 설정

# OpenAI API 키 설정
llm = OpenAI(api_key=openai_api_key, max_tokens=3000)

# 프롬프트 템플릿 설정 (여행 에이전트 페르소나)
# 단계별 프롬프트 템플릿
purpose_template = PromptTemplate(
    input_variables=["user_input"],
    template=(
        "안녕하세요! 여행 계획을 도와드리겠습니다. "
        "먼저 여행의 주된 목적이 무엇인지 알려주세요. 예를 들어 관광, 휴식, 모험 등입니다.\n\n"
        "사용자 입력: {user_input}\n"
        "여행 목적: "
    )
)
purpose_chain = LLMChain(llm=llm, prompt=purpose_template)

date_template = PromptTemplate(
    input_variables=["purpose"],
    template=(
        "좋습니다! 여행 목적이 '{purpose}'이군요. "
        "다음으로 여행 날짜와 기간은 언제인지 알려주시겠어요? 예: 10월 중순부터 3일간.\n"
    )
)
date_chain = LLMChain(llm=llm, prompt=date_template)

people_template = PromptTemplate(
    input_variables=["date"],
    template=(
        "감사합니다! 여행 날짜가 '{date}'로 설정되었군요. "
        "이번 여행에 함께 가는 인원은 몇 명인가요?\n"
    )
)
people_chain = LLMChain(llm=llm, prompt=people_template)

budget_template = PromptTemplate(
    input_variables=["people"],
    template=(
        "좋아요! 인원이 '{people}'명이군요. "
        "이번 여행의 예산은 어느 정도로 계획하고 계신가요?\n"
    )
)
budget_chain = LLMChain(llm=llm, prompt=budget_template)

recommendation_template = PromptTemplate(
    input_variables=["purpose", "date", "people", "budget"],
    template=(
        "여행 목적이 '{purpose}'이고, 여행 기간은 '{date}', 인원은 {people}명, "
        "예산은 {budget}으로 계획 중이시군요. 이에 맞는 맞춤형 여행 계획을 추천드리겠습니다!"
    )
)
recommendation_chain = LLMChain(llm=llm, prompt=recommendation_template)

@app.route('/generate', methods=['POST'])
def generate_response():
    user_input = request.json.get("user_input")

    # 세션 초기화 (새로운 요청을 위해)
    if user_input == "여행 계획을 도와주세요":
        session.clear()

    # 단계별 진행
    if "purpose" not in session:
        session["purpose"] = purpose_chain.invoke({"user_input": user_input})["text"].strip()
        response = "여행의 목적이 무엇인가요?"
        return jsonify({"response": response})

    elif "date" not in session:
        session["date"] = user_input.strip()
        response = people_chain.invoke({"date": session["date"]})["text"].strip()
        return jsonify({"response": response})

    elif "people" not in session:
        session["people"] = user_input.strip()
        response = budget_chain.invoke({"people": session["people"]})["text"].strip()
        return jsonify({"response": response})

    elif "budget" not in session:
        session["budget"] = user_input.strip()
        response = recommendation_chain.invoke({
            "purpose": session["purpose"],
            "date": session["date"],
            "people": session["people"],
            "budget": session["budget"]
        })["text"].strip()
        session.clear()  # 세션 초기화
        return jsonify({"response": response})

# Pinecone 및 OpenAI 설정
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("tamtam")
openai.api_key = openai_api_key

# 여행 일정을 추천하는 엔드포인트
@app.route('/recommend_itinerary', methods=['POST'])
def recommend_itinerary():
    user_input = request.json
    prompt = f"여행 일정 추천: {user_input['description']} 여행 기간: {user_input['duration']} 동반: {user_input['budget']}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # 사용 가능한 모델
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify({"recommendation": response['choices'][0]['message']['content']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 음식점 정보를 검색하는 엔드포인트
def get_query_vector(query):
    """사용자 쿼리를 OpenAI Embedding API로 벡터화"""
    response = openai.Embedding.create(
        input=query,
        model="text-embedding-ada-002"
    )
    vector = response["data"][0]["embedding"]
    return vector

@app.route('/search_restaurants', methods=['GET'])
def search_restaurants():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        # 사용자 쿼리를 벡터로 변환
        query_vector = get_query_vector(query)

        # Pinecone에서 쿼리 벡터를 사용해 상위 5개 결과 검색
        results = index.query(queries=[query_vector], top_k=5)

        # 검색 결과에서 음식점 이름만 추출
        restaurant_names = [result['metadata']['name'] for result in results['matches']]
        return jsonify({"restaurants": restaurant_names})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True) # KSH: 실시간 수정을 위해 debug=True 설정
