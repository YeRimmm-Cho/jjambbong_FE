# api 중간에 gpt 이중 구조로 호출 하기 위함
from langchain_openai import ChatOpenAI
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=openai_api_key)

def call_openai_gpt(messages):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content.strip()

def plan_persona(messages):
    """OpenAI GPT 최신 API 호출"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=1.1,
        max_tokens=10000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    return response.choices[0].message.content.strip()


plan_model = ChatOpenAI(
    model_name="gpt-4o-mini",
    max_tokens=10000,
    temperature=1.1,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
)