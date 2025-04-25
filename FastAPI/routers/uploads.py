from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from utils.pdf_reader import extract_text_from_pdf, chunk_text
from utils.vector_store import add_to_vector_store
import os
import shutil

router = APIRouter()
UPLOAD_DIRECTORY = "./uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/upload-pdf/", response_model=schemas.PDFDocument)
async def upload_pdf(
    file: UploadFile = File(...),
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is not a PDF")

    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract and store in vector DB
    text = extract_text_from_pdf(file_path)
    print(f"Extracted text: {text[:100]}...")
    chunks = chunk_text(text)
    add_to_vector_store(chunks)

    # Check if PDF already exists
    existing_pdf = db.query(models.PDFDocument).filter(models.PDFDocument.name == name).first()

    if existing_pdf:
        # Update existing entry
        existing_pdf.path = file_path
        existing_pdf.size = os.path.getsize(file_path)
        existing_pdf.updated_at = models.current_time()
        existing_pdf.is_processed = True
        db.commit()
        db.refresh(existing_pdf)
        return existing_pdf
    else:
        # Create new entry
        pdf_document = models.PDFDocument(
            name=name,
            path=file_path,
            size=os.path.getsize(file_path),
            created_at=models.current_time(),
            updated_at=models.current_time(),
            is_processed=True
        )
        db.add(pdf_document)
        db.commit()
        db.refresh(pdf_document)
        return pdf_document
