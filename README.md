# PDF Q&A Application

A full-stack application that allows users to upload PDF documents and ask questions about their content. The application leverages natural language processing to provide accurate answers based on the document content.

![image](https://github.com/user-attachments/assets/7241b1d5-3681-4dd3-a73c-1a7827cf6fe1)


## Features

- 📄 Upload and manage PDF documents
- 🔍 Ask questions about PDF content in natural language
- 💬 View answers generated from the document content
- 📱 Responsive design that works on desktop and mobile devices

## Tech Stack

### Frontend
- **React.js**: User interface and application logic
- **Tailwind CSS**: Styling and responsive design
- **Axios**: API requests handling

### Backend
- **FastAPI**: High-performance Python web framework
- **LangChain**: Framework for NLP and LLM applications
- **ChromaDB**: Vector database for document embeddings
- **SQLite**: Database for document metadata storage
- **PyMuPDF (fitz)**: PDF text extraction

### NLP Components
- **Transformers**: Question-answering pipeline
- **SentenceTransformers**: Text embeddings for semantic search
- **Ollama (optional)**: Local large language model support

## Architecture

The application follows a client-server architecture:

1. **Frontend**: React-based SPA that handles user interactions and displays results
2. **Backend API**: FastAPI server that processes requests and manages document data
3. **Vector Store**: ChromaDB that stores document chunks as embeddings for semantic search
4. **Database**: SQLite database that stores document metadata

### Workflow

1. User uploads a PDF document
2. Backend extracts text from the PDF, chunks it, and adds it to the vector store
3. User asks a question about the document
4. Backend retrieves relevant context from the vector store based on the question
5. A question-answering model processes the question and context to generate an answer
6. The answer is returned to the frontend and displayed to the user

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Jarvisss1/pdfQnA.git
cd pdfQnA/backend
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## API Documentation

### Upload a PDF

**Endpoint**: `POST /api/upload-pdf/`

**Form Parameters**:
- `file`: PDF file (multipart/form-data)
- `name`: Document name (string)

**Response**:
```json
{
  "id": 1,
  "name": "example.pdf",
  "path": "./uploads/example.pdf",
  "size": 12345,
  "created_at": "2023-07-01T12:00:00",
  "updated_at": "2023-07-01T12:00:00",
  "is_processed": true
}
```

### Ask a Question

**Endpoint**: `POST /api/ask/`

**Request Body**:
```json
{
  "question": "What is the main topic of this document?"
}
```

**Response**:
```json
{
  "question": "What is the main topic of this document?",
  "answer": "The main topic of this document is artificial intelligence and its applications in healthcare."
}
```

## Live Demo



https://github.com/user-attachments/assets/5cbaa117-a70c-4d67-acc2-bdb5f454339a



## Future Improvements

- User authentication: Add user accounts to manage document access
- History tracking: Save question-answer pairs for future reference
- Model selection: Allow users to choose different language models for answering
- Multi-document search: Search across multiple documents simultaneously
- Highlighting: Show the sources of information within the document

For any questions or support, please contact [yshivhare413@gmail.com](mailto:yshivhare413@gmail.com).
