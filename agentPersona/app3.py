from langchain.chains import LLMChain
from langchain.llms import OpenAI
from flask import Flask, request, jsonify, session, Response
from flask_cors import CORS
import json

import os
from dotenv import load_dotenv

from template import greeting_template, plan_template, modify_template, final_template
from openAi import call_openai_gpt

from datetime import timedelta

# env 변수 불러오기
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
secret_key = os.getenv("SECRET_KEY")
# env 변수 확인
print("Loaded SECRET_KEY:", secret_key)  # SECRET_KEY 출력
pinecone_api_key = os.getenv("PINECONE_API_KEY")

# Flask 앱 설정
app = Flask(__name__)
CORS(app)
app.secret_key = secret_key

app.permanent_session_lifetime = timedelta(hours=1)  # 세션 지속 시간 1시간
@app.before_request
def make_session_permanent():
    session.permanent = True
app.config.update(
    SESSION_COOKIE_SECURE=False,   # HTTPS가 아닌 환경에서도 쿠키 허용
    SESSION_COOKIE_HTTPONLY=True, # 클라이언트 측 스크립트에서 쿠키 접근 불가
    SESSION_COOKIE_SAMESITE='Lax' # 크로스 사이트 요청 제한 (Strict, Lax, None 중 선택)
)

# OpenAI API 설정
llm = OpenAI(api_key=openai_api_key, max_tokens=3000)

# 체인 생성
greeting_chain = LLMChain(llm=llm, prompt=greeting_template)
plan_chain = LLMChain(llm=llm, prompt=plan_template)
modify_chain = LLMChain(llm=llm, prompt=modify_template)
final_chain = LLMChain(llm=llm, prompt=final_template)


@app.route("/greeting", methods=["POST"])
def greeting():
    '''에이전트가 인사말을 건넴'''
    data = request.json
    front_input = data.get("front_input")

    generate_response = greeting_chain.run(
        front_input=front_input
    )

    print(f"LangChain Output: {generate_response}")  # LangChain 응답 파이썬에서 출력(한글 깨지는지 확인)
    # return jsonify({"generate_response": generate_response})
    generate_response_data = {"generate_response": generate_response}
    
    return Response(
        json.dumps(generate_response_data, ensure_ascii=False),  # ensure_ascii=False로 설정(한글 안깨지게 하기 위해)
        content_type="application/json; charset=utf-8"
    )

@app.route("/plan", methods=["POST"])
def plan():
    '''사용자 입력을 받아 여행 계획을 생성'''
    data = request.json
    travel_date = data.get("travel_date")
    travel_days = data.get("travel_days")
    travel_mate = data.get("travel_mate")
    travel_theme = data.get("travel_theme")

    final_prompt = plan_template.format(
        travel_date=travel_date,
        travel_days=travel_days,
        travel_mate=travel_mate,
        travel_theme=travel_theme
    )
    print(f"Generated Prompt:\n{final_prompt}")

    plan_response = plan_chain.run(
        travel_date=travel_date,
        travel_days=travel_days,
        travel_mate=travel_mate,
        travel_theme=travel_theme
    )
    session["current_plan"] = plan_response
    print(f"DEBUG: Saved to session: {session.get('current_plan')}")

    follow_up_message = "여행 계획이 생성되었습니다. 수정하고 싶은 부분이 있으면 말씀해주세요! 😊"

    # return jsonify({"response": plan_response, "follow_up": follow_up_message})

    plan_response_data = {"response": plan_response, "follow_up": follow_up_message}
    return Response(
        json.dumps(plan_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@app.route("/modify", methods=["POST"])
def modify():
    '''사용자 입력을 받아 여행 계획을 수정'''
    data = request.json
    modification_request = data.get("modify_request")
    current_plan = session.get("current_plan")

    # 수정 요청과 현재 계획 데이터 있는지 확인
    if not modification_request:
        return jsonify({"error": "Missing 'modify_request' in the request data"}), 401

    if not current_plan:
        return jsonify({"error": "No current plan found in the session"}), 403

    # 사용자 의도 판단 프롬프트
    intent_prompt = f"""
    사용자가 다음과 같은 요청을 보냈습니다: "{modification_request}".
    이 요청이 여행 계획 수정을 끝내겠다는 의도인지 판단해 주세요.
    응답은 "수정 종료", "수정 계속" 중 하나로만 작성해주세요.
    """
    # 사용자 의도 판단
    intent = call_openai_gpt([
        {"role": "system", "content": "You analyze user modification intent."},
        {"role": "user", "content": intent_prompt}
    ])

    # 수정 종료 하기
    if intent == "수정 종료":
        return jsonify({"response": "여행 계획에 만족하셨다니 다행입니다! 계획을 확정합니다. 😊"})

    # 수정 작업 하기
    modification_response = modify_chain.run(
        current_plan=current_plan,
        modification_request=modification_request
    )
    session["current_plan"] = modification_response

    follow_up_message = "수정이 완료되었습니다. 추가 수정이 필요하면 말씀해주세요! 😊"

    # return jsonify({"response": modification_response, "follow_up": follow_up_message})

    modify_response_data = {
        "response": modification_response,
        "follow_up": follow_up_message
    }
    return Response(
        json.dumps(modify_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@app.route("/modify2", methods=["POST"])
def modify2():
    '''사용자 입력을 받아 여행 계획을 수정'''
    data = request.json
    current_plan = data.get("current_plan")
    modify_request = data.get("modify_request")

    '''방식 1'''
    response = modify_chain.run(
        current_plan=current_plan,
        modify_request=modify_request
    )
    # '''방식 2''' 디테일 수정을 원할 때 갈구기
    # modify_prompt = modify_template.format(
    #     current_plan=current_plan,
    #     modify_request=modify_request
    # )

    # response = openai.ChatCompletion.create(
    #     model="gpt-4",
    #     messages=[{"role": "user", "content": modify_prompt}]
    # )
    # return jsonify({"modified_itinerary": response["choices"][0]["message"]["content"].strip()})
    return jsonify({"response": response})

@app.route("/final", methods=["POST"])
def final():
    '''여행 계획을 최종 확정'''
    data = request.json
    user_input = data.get("user_input")
    final_plan = session.get("current_plan")

    final_response = final_chain.run(user_input=user_input)
    session.clear()

    return jsonify({"response": final_response, "final_plan": final_plan})

# 세션 데이터 디버깅(세션 데이터 확인용)
@app.route("/debug_session", methods=["GET"])
def debug_session():
    """현재 세션 데이터 디버깅"""
    print("Current Session Data:", dict(session))
    return jsonify({"session_data": dict(session)})


@app.route("/set_session", methods=["POST"])
def set_session():
    # 요청 데이터에서 세션에 저장할 값 가져오기
    data = request.json
    session["test_key"] = data.get("value", "default_value")  # 세션에 저장
    session.permanent = True  # 세션 지속 설정
    print("DEBUG: Session after setting:", dict(session))  # 세션 데이터 출력
    return jsonify({"message": "Session set", "session_data": dict(session)})


@app.route("/get_session", methods=["GET"])
def get_session():
    data = session.get('current_plan')
    print(data)
    print("DEBUG: Current session:", dict(session))  # 현재 세션 데이터 출력
    return jsonify({"session_data": dict(session)})

@app.route("/clear_session", methods=["GET"])
def clear_session():
    """세션 데이터를 완전히 삭제"""
    session.clear()  # 세션 데이터 삭제
    print("DEBUG: Session cleared.")
    return jsonify({"message": "Session cleared successfully"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)