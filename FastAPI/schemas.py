from pydantic import BaseModel
from datetime import datetime

class PDFDocument(BaseModel):
    id: int
    name: str
    path: str
    size: int
    created_at: datetime
    updated_at: datetime
    is_processed: bool

    class Config:
        orm_mode = True
