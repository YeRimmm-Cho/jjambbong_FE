# api 중간에 gpt 이중 구조로 호출 하기 위함
import requests
from langchain_openai import ChatOpenAI
from openai import OpenAI
import os
from dotenv import load_dotenv
from requests.models import Response
from pyexpat.errors import messages


load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

client = OpenAI(api_key=openai_api_key)

def call_openai_gpt(messages):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content.strip()

# def location_json_gpt(travel_plan):
#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": location_prompt]
#         ],
#     functions = {
#         "travel_plan": travel_plan
#     }
#     )



plan_model = ChatOpenAI(
    model_name="gpt-4o-mini",
    max_tokens=10000,
    temperature=1.1,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
)

# Google Maps API 호출 함수
def get_place_details(place_name):
    url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": place_name,
        "inputtype": "textquery",
        "fields": "formatted_address,geometry",
        "key": GOOGLE_MAPS_API_KEY,
        "locationbias": "circle:50000@33.4996,126.5312"  # 제주도 중심 좌표와 반경 50km
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data.get('candidates'):
            candidate = data['candidates'][0]
            return {
                "name": place_name,
                "location": candidate.get("formatted_address"),
                "coordinate": candidate["geometry"]["location"]
            }
    return {"name": place_name, "location": "정보 없음", "coordinate": "정보 없음"}