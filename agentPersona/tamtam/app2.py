from flask import Flask, request, jsonify, session
from flask import json, make_response
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_community.llms import OpenAI
from langchain.chains import LLMChain
from pinecone import Pinecone
import openai

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
secret_key = os.getenv("SECRET_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS
app.secret_key = secret_key  # Session secret key
app.config['JSON_AS_ASCII'] = False  # Fix Korean text encoding issue

# OpenAI API setup
llm = OpenAI(api_key=openai_api_key, max_tokens=3000)

# Define prompt templates
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

# Pinecone setup
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("tamtam")
openai.api_key = openai_api_key

def get_query_vector(query):
    """Convert user query to vector using OpenAI embedding."""
    response = openai.Embedding.create(
        input=query,
        model="text-embedding-ada-002"
    )
    return response["data"][0]["embedding"]

# make_response로 한글 깨짐 방지
def json_response(data, status=200):
    response = make_response(json.dumps(data, ensure_ascii=False), status)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

@app.route('/generate', methods=['POST'])
def generate_response():
    user_input = request.json.get("user_input")

    # 세션 초기화 및 첫 질문 생성
    if user_input == "여행 계획을 도와주세요":
        session.clear()  # 세션 초기화
        response = purpose_chain.invoke({"user_input": user_input})["text"].strip()  # 템플릿 기반 첫 질문 생성
        session["step"] = "purpose"
        return json_response({"response": response})  # 사용자에게 질문 반환

    # 여행 목적 단계
    if session.get("step") == "purpose":
        session["purpose"] = user_input.strip()  # 목적 저장
        response = date_chain.invoke({"purpose": session["purpose"]})["text"].strip()
        session["step"] = "date"
        return json_response({"response": response})  # 다음 질문 반환

    # 여행 날짜 단계
    if session.get("step") == "date":
        session["date"] = user_input.strip()  # 날짜 저장
        response = people_chain.invoke({"date": session["date"]})["text"].strip()
        session["step"] = "people"
        return json_response({"response": response})  # 다음 질문 반환

    # 인원 단계
    if session.get("step") == "people":
        session["people"] = user_input.strip()  # 인원 저장
        response = budget_chain.invoke({"people": session["people"]})["text"].strip()
        session["step"] = "budget"
        return json_response({"response": response})  # 다음 질문 반환

    # 예산 단계
    if session.get("step") == "budget":
        session["budget"] = user_input.strip()  # 예산 저장

        # 최종 추천 생성
        travel_recommendation = recommendation_chain.invoke({
            "purpose": session["purpose"],
            "date": session["date"],
            "people": session["people"],
            "budget": session["budget"]
        })["text"].strip()

        session.clear()  # 세션 초기화
        return json_response({"response": travel_recommendation})

if __name__ == "__main__":
    app.run(port=5000, debug=True)