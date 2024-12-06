from flask_sqlalchemy import SQLAlchemy
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone, Index
from langchain_pinecone import PineconeVectorStore
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# sql DB 초기화
db = SQLAlchemy()

# pinecone 초기화
load_dotenv()


pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone = Pinecone(
    api_key=pinecone_api_key,
    environment="us-east-1"
)
index_name = "restaurants"
embeddings = OpenAIEmbeddings(
    model="all-MiniLM-L6-v2"
)
vectorstore = PineconeVectorStore(
    index_name=index_name,
    embedding=embeddings
)
retriever = vectorstore.as_retriever()


# 임베딩 모델 초기화 (Pinecone와 동일한 모델 사용)
model = SentenceTransformer('all-MiniLM-L6-v2')
def search_theme_in_pinecone(query, top_k=5):
    """
    PineconeVectorStore에서 쿼리를 검색하여 관련 데이터를 반환합니다.
    :param query: 검색할 텍스트
    :param top_k: 반환할 상위 결과 수
    :return: 검색된 결과 리스트
    """
    # similarity_search 메서드 사용
    results = vectorstore.similarity_search(query, k=top_k)

    # 검색 결과 정리
    return [
        {
            "question": result.page_content,  # 질문 내용
            "theme": result.metadata.get("theme", "N/A"),  # 테마
            # "location": result.metadata.get("location", "N/A"),  # 장소
            "restaurants": result.metadata.get("restaurants", [])  # 음식점 정보
        }
        for result in results
    ]
