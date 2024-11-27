from flask import Blueprint, request, jsonify, session, Response
from langchain_core.runnables import RunnablePassthrough
from pyexpat.errors import messages

from models import TravelPlan
from tamtam.openAi import call_openai_gpt, plan_persona, plan_model
# from tamtam.template import final_template
from tamtam.template2 import agent_prompt, plan_prompt, modify_prompt, final_template
from langchain.chains import LLMChain
from langchain_core.output_parsers import StrOutputParser
from langchain.llms import OpenAI
from db import db, retriever, search_theme_in_pinecone
import os
import json

# 1: env 변수 불러오기
openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")

# 3: OpenAI API 설정
llm = OpenAI(
    api_key=openai_api_key,
    model_name="gpt-4o-mini",  # 원하는 모델 이름
    max_tokens=3000,          # 토큰 제한
    temperature=1.1,          # 창의성 조정
    top_p=1,                  # 확률 분포
    frequency_penalty=0,      # 반복 사용 억제
    presence_penalty=0        # 새 주제 생성 유도
)

# 4: 체인 생성
# greeting_chain = LLMChain(llm=llm, prompt=greeting_template)
# plan_chain = LLMChain(llm=llm, prompt=plan_template)
# modify_chain = LLMChain(llm=llm, prompt=modify_template)
# final_chain = LLMChain(llm=llm, prompt=final_template)

# Blueprint 생성
main_bp = Blueprint("main", __name__)

# 5: 라우트 생성
@main_bp.route("/greeting", methods=["POST"])
def greeting():
    '''에이전트가 인사말을 건넴'''
    data = request.json
    front_input = data.get("front_input")

    output_parser = StrOutputParser()
    greeting_chain = agent_prompt | plan_model | output_parser

    input_data = {
        "front_input": front_input
    }

    greeting_response = greeting_chain.invoke(input_data)
    greeting_response_data = {"response": greeting_response}

    return Response(
        json.dumps(greeting_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@main_bp.route("/plan", methods=["POST"])
def plan():
    '''사용자 입력을 받아 여행 계획을 생성'''
    data = request.json
    travel_date = data.get("travel_date")
    travel_days = data.get("travel_days")
    travel_mate = data.get("travel_mate")
    travel_theme = data.get("travel_theme")


    # Pinecone에서 테마 관련 정보 검색
    search_results = search_theme_in_pinecone(travel_theme)
    theme_context = "\n".join([
        f"Q: {result['question']}\nA: {result['restaurants']}"
        for result in search_results
    ])

    '''ver2'''
    output_parser = StrOutputParser()

    # plan_chain = (
    #         {"theme_context": retriever,
    #          "travel_date": RunnablePassthrough(),
    #          "travel_days": RunnablePassthrough(),
    #          "travel_mate": RunnablePassthrough(),
    #          "travel_theme": RunnablePassthrough()}|
    #          plan_prompt | plan_model | output_parser)

    plan_chain = plan_prompt | plan_model | output_parser

    input_data = {
        "travel_date": travel_date,
        "travel_days": travel_days,
        "travel_mate": travel_mate,
        "travel_theme": travel_theme,
        "theme_context": theme_context
    }

    plan_response = plan_chain.invoke(input_data)

    db.session.add(TravelPlan(plan_response=plan_response))
    db.session.commit()
    follow_up_message = "여행 계획이 생성되었습니다. 수정하고 싶은 부분이 있으면 말씀해주세요! 😊"

    plan_response_data = {"response": plan_response, "follow_up": follow_up_message}
    return Response(
        json.dumps(plan_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@main_bp.route("/modify", methods=["POST"])
def modify3():
    """사용자 입력을 받아 여행 계획을 수정"""
    data = request.json
    # plan_id = data.get("plan_id")  # 수정할 여행 계획 ID
    plan_id = 53
    modification_request = data.get("modify_request")

    # 수정 요청과 ID 확인
    if not modification_request:
        return jsonify({"error": "Missing 'modify_request' in the request data"}), 401

    # if not plan_id:
    #     return jsonify({"error": "Missing 'plan_id' in the request data"}), 403

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
    # print(intent)
    # # 수정 종료 하기
    # if intent == "수정 종료":
    #     end_message = "여행 계획에 만족하셨다니 다행입니다! 계획을 확정합니다. 😊"
    #     inform = call_openai_gpt([
    #         {"role": "system", "content": final_template.format()},
    #     ])
    #     final_response_data = {
    #         "end_message": end_message,
    #         "inform": inform
    #     }
    #     return Response(
    #         json.dumps(final_response_data, ensure_ascii=False),
    #         content_type="application/json; charset=utf-8"
    #     )
    # 디버깅: intent의 값과 타입 출력
    print(f"Intent Value: '{intent}' (type: {type(intent)})")
    intent_cleaned = intent.strip().strip('"')

    # 공백 제거 후 조건 비교
    if intent.strip() == "수정 종료":
        end_message = "여행 계획에 만족하셨다니 다행입니다! 계획을 확정합니다. 😊"
        inform = call_openai_gpt([
            {"role": "system", "content": final_template.format()},
        ])
        final_response_data = {
            "response": end_message,
            "follow_up": inform
        }
        return Response(
            json.dumps(final_response_data, ensure_ascii=False),
            content_type="application/json; charset=utf-8"
        )

    # 디버깅: 조건 실패 시 로그 출력
    print(f"Condition not met. Cleaned Intent Value: '{intent_cleaned}'")

    # 데이터베이스에서 여행 계획 가져오기
    travel_plan = TravelPlan.query.get(plan_id)  # 특정 ID에 해당하는 행 가져오기

    if not travel_plan:
        return jsonify({"error": "No travel plan found with the provided ID"}), 404

    output_parser = StrOutputParser()
    modify_chain = modify_prompt | plan_model | output_parser

    input_data = {
        "current_plan": travel_plan.plan_response,
        "modification_request": modification_request
    }

    modification_response = modify_chain.invoke(input_data)

    # 수정된 여행 계획을 데이터베이스에 업데이트
    travel_plan.plan_response = modification_response
    db.session.commit()

    follow_up_message = "수정이 완료되었습니다. 추가 수정이 필요하면 말씀해주세요! 😊"

    # JSON 응답 생성
    modify_response_data = {
        "response": modification_response,
        "follow_up": follow_up_message
    }
    return Response(
        json.dumps(modify_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )
#
# # @main_bp.route("/final", methods=["POST"])
# # def final():
# #     '''여행 계획을 최종 확정'''
# #     data = request.json
# #     plan_id = data.get("plan_id")  # 수정할 여행 계획 ID
# #     final_plan = session.get("current_plan")
# #
# #     # data = request.json
# #     # plan_id = data.get("plan_id")  # 수정할 여행 계획 ID
# #     # modification_request = data.get("modify_request")
# #
# #     final_response = final_chain.run(user_input=user_input)
# #     session.clear()
# #
# #     return jsonify({"response": final_response, "final_plan": final_plan})
#
# # 세션 데이터 디버깅(세션 데이터 확인용)
# @main_bp.route("/debug_session", methods=["GET"])
# def debug_session():
#     """현재 세션 데이터 디버깅"""
#     print("Current Session Data:", dict(session))
#     return jsonify({"session_data": dict(session)})
#
#
# @main_bp.route("/set_session", methods=["POST"])
# def set_session():
#     # 요청 데이터에서 세션에 저장할 값 가져오기
#     data = request.json
#     session["test_key"] = data.get("value", "default_value")  # 세션에 저장
#     session.permanent = True  # 세션 지속 설정
#     print("DEBUG: Session after setting:", dict(session))  # 세션 데이터 출력
#     return jsonify({"message": "Session set", "session_data": dict(session)})
#
#
# @main_bp.route("/get_session", methods=["GET"])
# def get_session():
#     data = session.get('current_plan')
#     print(data)
#     print("DEBUG: Current session:", dict(session))  # 현재 세션 데이터 출력
#     return jsonify({"session_data": dict(session)})
#
# @main_bp.route("/clear_session", methods=["GET"])
# def clear_session():
#     """세션 데이터를 완전히 삭제"""
#     session.clear()  # 세션 데이터 삭제
#     print("DEBUG: Session cleared.")
#     return jsonify({"message": "Session cleared successfully"})
#
#
# def register_routes(app):
#     '''라우트를 Flask 앱에 등록'''
#     app.register_blueprint(main_bp)