from flask import Flask, request, jsonify
import os
import openai
from pinecone import Pinecone
from dotenv import load_dotenv

app = Flask(__name__)

# 환경 변수 로드
load_dotenv()
pinecone_api_key = os.getenv("PINECONE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

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
    app.run(port=5000)
