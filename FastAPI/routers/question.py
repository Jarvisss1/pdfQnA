from fastapi import APIRouter
from pydantic import BaseModel
from utils.conversational_chain import ask_with_context

router = APIRouter()

class Query(BaseModel):
    question: str

@router.post("/ask/")
def ask_question(query: Query):
    try:
        answer = ask_with_context(query.question)
        return {"answer": answer}
    except Exception as e:
        print("❌ Error in ask_with_context:", str(e))
        return {"error": str(e)}

