from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI

app = Flask(__name__)

# OpenAI 설정
llm = OpenAI(api_key="your_openai_api_key")

questions = [
    "여행 목적이 무엇인가요?",
    "언제부터 언제까지 며칠 동안 다녀오실 계획인가요?",
    "몇 명이 함께 가나요?",`
    "예산은 어느 정도로 계획하고 계신가요?"
]

current_question_index = 0

@app.route('/ask_question', methods=['POST'])
def ask_question():
    global current_question_index
    if current_question_index < len(questions):
        question = questions[current_question_index]
        current_question_index += 1
    else:
        question = "모든 질문이 완료되었습니다. 감사합니다!"

    return jsonify({"question": question})

if __name__ == "__main__":
    app.run(port=5000)
