from flask_sqlalchemy import SQLAlchemy
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone, Index
from langchain_pinecone import PineconeVectorStore
# from langchain.vectorstores import PineconeVectorStore
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# sql DB 초기화
db = SQLAlchemy()

# Pinecone 초기화
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone = Pinecone(api_key=pinecone_api_key, environment="us-east-1")

# Pinecone 인덱스 이름
index_name = "tamtam2"
index = pinecone.Index(index_name)  # Pinecone 인덱스 정의

# OpenAI Embeddings 및 PineconeVectorStore 설정
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

# Pinecone retriever 설정
retriever = vectorstore.as_retriever()

# 임베딩 모델 로딩 (Pinecone와 동일한 모델 사용)
model = SentenceTransformer('all-MiniLM-L6-v2')
def search_theme_in_pinecone(query, top_k=5):
    """
    Pinecone에서 관련된 데이터를 검색하여 반환합니다.
    :param query: 검색할 텍스트 (여행 테마)
    :param top_k: 반환할 상위 결과 수
    :return: 검색된 결과 리스트
    """
    # LangChain retriever 사용하여 Pinecone에서 관련된 항목 검색
    results = retriever.get_relevant_documents(query)

    # 검색된 결과 정리하여 반환
    return [
        {
            "name": result.metadata.get("name", "N/A"),
            "address": result.metadata.get("address", "N/A"),
            "rating": result.metadata.get("rating", "N/A"),
            "category": result.metadata.get("category", "N/A"),
            "review": result.metadata.get("review", ""),
            "latitude": result.metadata.get("latitude", "N/A"),
            "longitude": result.metadata.get("longitude", "N/A")
        }
        for result in results
    ]
