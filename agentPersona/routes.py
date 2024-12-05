from flask import Blueprint, request, jsonify, session, Response
from langchain_core.runnables import RunnablePassthrough
from pyexpat.errors import messages

from tamtam.template2 import location_template
from models import TravelPlan, SavedPlan
from tamtam.openAi import call_openai_gpt, plan_model, get_place_details
# from tamtam.template import final_template
from tamtam.template2 import (agent_prompt, plan_prompt,
                              modify_prompt, final_template,
                              location_prompt)
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
    # user_id = data.get("user_id") # 사용자 ID
    user_id = 1 # 사용자 ID
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

    output_parser = StrOutputParser()
    plan_chain = plan_prompt | plan_model | output_parser

    input_data = {
        "travel_date": travel_date,
        "travel_days": travel_days,
        "travel_mate": travel_mate,
        "travel_theme": travel_theme,
        "theme_context": theme_context
    }
    # 여행 계획 생성
    plan_response = plan_chain.invoke(input_data)

    # 사용자 입력 정보 json
    travel_info = {
        "travel_date": travel_date,
        "travel_days": travel_days,
        "travel_mate": travel_mate,
        "travel_theme": travel_theme
    }

    # 장소 정보 추출
    travel_plan = plan_response

    if not travel_plan:
        return Response(
            json.dumps({"error": "travel_plan is required"}, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
            status=400
        )

    output_parser = StrOutputParser()
    location_chain = location_prompt | plan_model | output_parser

    input_data = {"travel_plan": travel_plan}
    location_response = location_chain.invoke(input_data)
    location_response = location_response.strip().strip("```json")

    print(travel_info)
    print(plan_response)
    print(location_response)

    # 여행 계획 테이블에 세션 컨셉으로 저장
    if TravelPlan.query.get(user_id):
        existing_plan = TravelPlan.query.get(user_id)
        existing_plan.travel_info = json.dumps(travel_info)
        existing_plan.plan_response = plan_response
        existing_plan.location_info = location_response
    else:
        db.session.add(TravelPlan(user_id=user_id,
                                  travel_info=json.dumps(travel_info),
                                  plan_response=plan_response,
                                  location_info=json.dumps(location_response))
                     )

    db.session.commit()
    follow_up_message = "여행 계획이 생성되었습니다. 수정하고 싶은 부분이 있으면 말씀해주세요! 😊"

    # """location 추가"""
    # travel_plan = plan_response
    #
    # if not travel_plan:
    #     return Response(
    #         json.dumps({"error": "travel_plan is required"}, ensure_ascii=False),
    #         content_type="application/json; charset=utf-8",
    #         status=400
    #     )
    #
    # try:
    #     # LangChain 사용
    #     output_parser = StrOutputParser()

    #     location_chain = location_prompt | plan_model | output_parser
    #
    #     input_data = {"travel_plan": travel_plan}
    #     gpt_response = location_chain.invoke(input_data)
    #
    #     # GPT 응답에서 JSON만 추출
    #     try:
    #         # GPT 응답 파싱
    #         start_index = gpt_response.find("{")
    #         end_index = gpt_response.rfind("}") + 1
    #         json_data = gpt_response[start_index:end_index]
    #         extracted_places = json.loads(json_data)["places"]
    #     except (ValueError, KeyError, TypeError) as e:
    #         return Response(
    #             json.dumps({"error": f"Failed to parse GPT response: {str(e)}"}, ensure_ascii=False),
    #             content_type="application/json; charset=utf-8",
    #             status=500
    #         )
    #
    #     # Google Maps API 호출로 상세 정보 보완
    #     detailed_places = {}
    #     for day, places in extracted_places.items():
    #         detailed_places[day] = [
    #             get_place_details(place["name"]) for place in places
    #         ]
    #
    #     plan_response_data = {"response": plan_response,
    #                           "follow_up": follow_up_message,
    #                           "travel_info": data,
    #                           "places": detailed_places}
    #     return Response(
    #         json.dumps(plan_response_data, ensure_ascii=False),
    #         content_type="application/json; charset=utf-8"
    #     )
    # except Exception as e:
    #     return Response(
    #         json.dumps({"error": str(e)}, ensure_ascii=False),
    #         content_type="application/json; charset=utf-8",
    #         status=500
    #     )

    location_response = json.loads(location_response)
    print(type(plan_response))
    print(type(travel_info))
    print(type(location_response))

    plan_response_data = {"response": plan_response,
                          "follow_up": follow_up_message,
                          "user_id": user_id,
                          "travel_info": travel_info,
                          "location_info": location_response}
    return Response(
        json.dumps(plan_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@main_bp.route("/modify", methods=["POST"])
def modify3():
    """사용자 입력을 받아 여행 계획을 수정"""
    data = request.json
    # user_id = data.get("user_id") # 사용자 ID
    user_id = 1 # 사용자 ID
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
    
    '나 그냥 2월 7일에 서울로 돌아오고 싶어' 와 같은 입력은 수정 종료가 아니라,
    '수정 계속'으로 판단해야 합니다.
    """
    # 사용자 의도 판단
    intent = call_openai_gpt([
        {"role": "system", "content": "You analyze user modification intent."},
        {"role": "user", "content": intent_prompt}
    ])


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
    travel_plan = TravelPlan.query.get(user_id)  # 특정 ID에 해당하는 행 가져오기

    if not travel_plan:
        return jsonify({"error": "No travel plan found with the provided ID"}), 404

    output_parser = StrOutputParser()
    modify_chain = modify_prompt | plan_model | output_parser

    input_data = {
        "current_plan": travel_plan.plan_response,
        "modification_request": modification_request
    }

    modification_response = modify_chain.invoke(input_data)

    # 장소 정보 추출
    travel_plan = modification_response

    if not travel_plan:
        return Response(
            json.dumps({"error": "travel_plan is required"}, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
            status=400
        )

    output_parser = StrOutputParser()
    location_chain = location_prompt | plan_model | output_parser

    input_data = {"travel_plan": travel_plan}
    location_response = location_chain.invoke(input_data)
    location_response = location_response.strip().strip("```json")

    print(modification_response)
    print(location_response)

    existing_plan = TravelPlan.query.get(user_id)

    existing_plan.plan_response = modification_response
    existing_plan.location_info = location_response

    db.session.commit()

    travel_info = TravelPlan.query.get(user_id).travel_info
    follow_up_message = "수정이 완료되었습니다. 추가 수정이 필요하면 말씀해주세요! 😊"

    location_response = json.loads(location_response)
    # JSON 응답 생성
    modify_response_data = {
        "response": modification_response,
        "follow_up": follow_up_message,
        "user_id": user_id,
        "travel_info": travel_info,
        "location_info": location_response
    }

    return Response(
        json.dumps(modify_response_data, ensure_ascii=False),
        content_type="application/json; charset=utf-8"
    )

@main_bp.route("/saveplan", methods=["POST"])
def save_plan():
    '''여행 계획을 저장'''
    data = request.json
    user_id = data.get("user_id")
    travel_name = data.get("travel_name")

    # 데이터베이스에서 여행 계획 가져오기
    travel_plan = TravelPlan.query.filter_by(user_id=user_id).first()

    travel_info = travel_plan.travel_info
    plan_response = travel_plan.plan_response
    location_info = travel_plan.location_info

    print(type(travel_info))
    print(type(plan_response))
    print(type(location_info))

    db.session.add(SavedPlan(
                        user_id=user_id,
                        travel_name=travel_name,
                        travel_info=travel_info,
                        plan_response=plan_response,
                        location_info=location_info)
    )

    db.session.commit()

    message = "여행 계획 저장 성공!"

    return jsonify({"message": message})

@main_bp.route("/loadplan_mypage", methods=["POST"])
def load_plan_mypage():
    '''저장된 여행 계획을 불러오기'''
    data = request.json
    user_id = data.get("user_id")

    saved_plans = SavedPlan.query.filter_by(user_id=user_id).all()

    if not saved_plans:
        return jsonify({"message": "저장된 여행 계획이 없습니다.", "plans": []}), 200

    print(len(saved_plans))

    plans = []
    k=0
    while k < len(saved_plans):
        for plan in saved_plans:
            print(type(plan.location_info))
            location_info = json.loads(plan.location_info)
            print(type(location_info))
            print(location_info)

            plan = {
                    "travel_name": plan.travel_name,
                    "hashTag": location_info.get("hash_tag"),
                    "createdAt": plan.created_at
                }
            plans.append(plan)
            k += 1

    return jsonify({"message": "저장된 여행 계획을 불러왔습니다.", "plans": plans})

@main_bp.route("/loadplan", methods=["POST"])
def load_plan():
    '''저장된 여행 계획을 불러오기'''
    data = request.json
    user_id = data.get("user_id")
    travel_name = data.get("travel_name")

    saved_plan = SavedPlan.query.filter(user_id=user_id, travel_name=travel_name).first()

    if not saved_plan:
        return jsonify({"message": "저장된 여행 계획이 없습니다."}), 404

    location_info = json.loads(saved_plan.location_info)

    return jsonify({"message": "저장된 여행 계획을 불러왔습니다.", "plan": location_info})

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


@main_bp.route("/location", methods=["POST"])
def location():
    '''여행 계획에서 장소 정보 추출'''
    data = request.json
    travel_plan = data.get("travel_plan")

    if not travel_plan:
        return Response(
            json.dumps({"error": "travel_plan is required"}, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
            status=400
        )

    try:
        # LangChain 사용
        output_parser = StrOutputParser()
        location_chain = location_prompt | plan_model | output_parser

        input_data = {"travel_plan": travel_plan}
        gpt_response = location_chain.invoke(input_data)

        # GPT 응답에서 JSON만 추출
        try:
            # GPT 응답 파싱
            start_index = gpt_response.find("{")
            end_index = gpt_response.rfind("}") + 1
            json_data = gpt_response[start_index:end_index]
            extracted_places = json.loads(json_data)["places"]
        except (ValueError, KeyError, TypeError) as e:
            return Response(
                json.dumps({"error": f"Failed to parse GPT response: {str(e)}"}, ensure_ascii=False),
                content_type="application/json; charset=utf-8",
                status=500
            )

        # Google Maps API 호출로 상세 정보 보완
        detailed_places = {}
        for day, places in extracted_places.items():
            detailed_places[day] = [
                get_place_details(place["name"]) for place in places
            ]

        # 최종 JSON 반환
        location_response_data = {"places": detailed_places}
        return Response(
            json.dumps(location_response_data, ensure_ascii=False),
            content_type="application/json; charset=utf-8"
        )
    except Exception as e:
        return Response(
            json.dumps({"error": str(e)}, ensure_ascii=False),
            content_type="application/json; charset=utf-8",
            status=500
        )
