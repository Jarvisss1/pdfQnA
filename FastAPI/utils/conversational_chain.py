import os
from dotenv import load_dotenv
from langchain_community.llms.ollama import Ollama
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from collections import deque

load_dotenv()

# Prompt template for RAG - more concise
PROMPT_TEMPLATE = """
Based on this context:
{context}

Answer this question: {question}
"""

# Embedding + Chroma setup
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectordb = Chroma(persist_directory="./chroma", embedding_function=embedding)
# Retrieve fewer docs to reduce context size
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# Initialize Ollama with faster model options
model = Ollama(
    model="mistral",
    # Performance options
    temperature=0.1,  # Lower temperature = faster, more deterministic 
    num_ctx=2048,     # Limit context window
    num_thread=4      # Use multiple threads if available
)

# Memory & history
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
conversation_history = deque(maxlen=5)

def ask_with_context(user_message: str) -> str:
    try:
        # Minimal debugging info to reduce overhead
        collection_names = vectordb._client.list_collections()
        print("📚 Chroma collections:", collection_names)

        # ———— Retrieve relevant context ————
        retrieved_docs = retriever.invoke(user_message)
        docs = [doc.page_content for doc in retrieved_docs]
        
        print(f"🔍 Retrieved {len(docs)} context chunks")
        print(f"🔍 Question: {user_message}")
        
        # Combine context but limit size
        context = "\n\n".join(docs)
        if len(context) > 3000:  # Limit context size for faster processing
            context = context[:3000] + "..."
        
        print(f"🔍 Context length: {len(context)} chars")

        # ———— Process query ————
        if not context.strip():
            return "I couldn't find relevant information to answer your question in the document."

        # Create prompt - simpler template
        prompt = f"Based on this context:\n{context}\n\nAnswer this question: {user_message}"
        
        # Add a timeout to avoid hanging
        print("🔄 Querying Ollama model (this may take a moment)...")
        
        # Call Ollama model
        response = model.invoke(prompt)
        print(f"✅ Response received")
        
        # ———— Update memory & history ————
        memory.chat_memory.add_user_message(user_message)
        memory.chat_memory.add_ai_message(response)
        conversation_history.append({"user": user_message, "bot": response})

        return response

    except Exception as e:
        error_message = f"Error in ask_with_context: {str(e)}"
        print(f"❌ {error_message}")
        return f"I encountered an error while trying to answer your question: {str(e)}"