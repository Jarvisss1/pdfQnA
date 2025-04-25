from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import HuggingFaceHub
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Hugging Face API key
hf_token = os.getenv("HF_API_KEY")

# LLM from Hugging Face (e.g., google/flan-t5-large or facebook/blenderbot-3B)
llm = HuggingFaceHub(repo_id="google/flan-t5-xxl",  
model_kwargs={"temperature": 0.5, "max_length": 512},
    huggingfacehub_api_token=hf_token,
)

# Embedding model
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Vector store
vectordb = Chroma(persist_directory="./chroma", embedding_function=embedding)
retriever = vectordb.as_retriever(search_kwargs={"k": 5})

# Chat memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Chain setup
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
)

def ask_with_context(query: str):
    return qa_chain.run(query)
