import os
from dotenv import load_dotenv
from transformers import pipeline
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from collections import deque

load_dotenv()

# Setup QA pipeline with BERT large model
pipe = pipeline(
    "question-answering", 
    model="google-bert/bert-large-uncased-whole-word-masking-finetuned-squad",
    token=os.getenv("HF_API_KEY", None)
)

# Embedding + Chroma setup
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectordb = Chroma(persist_directory="./chroma", embedding_function=embedding)
retriever = vectordb.as_retriever(search_kwargs={"k": 5})  # Retrieve 5 documents for better context

# Memory & history
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
conversation_history = deque(maxlen=5)

def ask_with_context(user_message: str) -> str:
    try:
        # ———— Print collections for debugging ————
        collection_names = vectordb._client.list_collections()
        print("📚 Chroma collection names:", collection_names)

        # Sample collection info
        for name in collection_names:
            coll = vectordb._client.get_collection(name=name)
            try:
                count = coll.count()
                print(f"🔐 Collection `{name}` has {count} items.")

                if count > 0:
                    sample = coll.get(limit=2, include=["documents", "embeddings"])
                    for i, emb in enumerate(sample["embeddings"][:2]):
                        print(f"   • Document {i}, emb[:5]={emb[:5]}")
            except Exception as e:
                print(f"Collection info issue: {str(e)}")

        # ———— Retrieve relevant context ————
        retrieved_docs = retriever.invoke(user_message)
        
        # No preprocessing - use the raw text
        docs = [doc.page_content for doc in retrieved_docs]
        print(f"🔍 Retrieved {len(docs)} context chunks")
        print(f"🔍 Question: {user_message}")
        
        # Combine all context
        context = "\n\n".join(docs)
        print(f"🔍 Context length: {len(context)} chars")
        print(f"🔍 Sample context: {context[:300]}...")

        # ———— Process query ————
        if not context.strip():
            return "I couldn't find relevant information to answer your question in the document."

        # Use the BERT large model to get the answer
        result = pipe(
            question=user_message,
            context=context,
            handle_impossible_answer=True,
            max_answer_len=200  # Allow for longer answers
        )
        
        answer = result['answer']
        confidence = result['score']
        
        print(f"🤖 QA Answer: {answer} (confidence: {confidence:.2f})")
        
        # Format the response
        if confidence > 0.2:
            response = answer
        else:
            response = "I couldn't find a confident answer to your question in the document."

        # ———— Update memory & history ————
        memory.chat_memory.add_user_message(user_message)
        memory.chat_memory.add_ai_message(response)
        conversation_history.append({"user": user_message, "bot": response})

        return response

    except Exception as e:
        error_message = f"Error in ask_with_context: {str(e)}"
        print(f"❌ {error_message}")
        return f"I encountered an error while trying to answer your question: {str(e)}"