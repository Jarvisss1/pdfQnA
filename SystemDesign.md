## System Architecture 

![diagram-export-4-27-2025-5_30_16-PM](https://github.com/user-attachments/assets/6c574db6-6625-4b16-9be3-f63d83cfb631)

---

## HLD

![diagram-export-4-27-2025-5_24_51-PM](https://github.com/user-attachments/assets/b1799737-02d1-43be-89db-70f870142ff2)

---

## Low-Level Design (LLD) 

## 🖥️ Frontend - React Components

| Component      | Purpose |
|:---------------|:--------|
| `Header.jsx`    | App title, file upload button, filename display |
| `UploadPDF.jsx` | Handles file selection and API upload call |
| `InputBox.jsx`  | Input field for asking questions |
| `ChatArea.jsx`  | Shows user questions and AI answers |
| `App.jsx`       | Controls overall app state (PDF uploaded, chat history) |
| `main.jsx`      | Bootstraps the app with Vite |

---

### ➡️ Frontend Flow

1. User uploads PDF via `UploadPDF` → calls `/api/upload-pdf`
2. File name stored in app state.
3. User asks a question via `InputBox`.
4. Sends API request `/api/ask` with question.
5. Displays answer from server in `ChatArea`.

---

## 🛠️ Backend - FastAPI Setup

| File                  | Purpose |
|:----------------------|:--------|
| `main.py`              | Creates FastAPI app and adds CORS |
| `database.py`          | Configures SQLAlchemy with SQLite |
| `models/document.py`   | Document database model |
| `schemas/document.py`  | Pydantic schemas for validation |
| `routers/uploads.py`   | Endpoint to upload and process PDF |
| `routers/question.py`  | Endpoint to answer questions |
| `utils/pdf_reader.py`  | Functions to extract text from PDF |
| `utils/vector_store.py`| Functions to save/query ChromaDB |
| `utils/conversational_chain.py` | QA pipeline using LLM |

---

### ➡️ Backend Endpoints

| Endpoint                | Method | Purpose |
|:-------------------------|:------|:--------|
| `/api/upload-pdf/`        | POST   | Upload a new PDF |
| `/api/ask/`               | POST   | Ask a question based on PDF content |
| `/api/documents/`         | GET    | List uploaded documents |

---

### ➡️ Backend Flow

1. **PDF Upload (`/api/upload-pdf/`)**
   - Receive file upload.
   - Save file to local storage.
   - Extract text using `PyMuPDF`.
   - Chunk text into small pieces.
   - Generate embeddings using SentenceTransformer.
   - Store embeddings into ChromaDB.
   - Save document metadata in SQLite.

2. **Question Answering (`/api/ask/`)**
   - Receive a question.
   - Embed the question.
   - Query ChromaDB for similar document chunks.
   - Combine relevant chunks into a context.
   - Pass context + question to a QA model (Ollama Mistral).
   - Return the generated answer.

---

## 🗃️ Database Schemas

### SQLite - Documents Table

| Column        | Type     | Description |
|:--------------|:---------|:------------|
| id             | Integer  | Primary Key |
| name           | String   | PDF file name |
| path           | String   | File storage path |
| size           | Integer  | File size in bytes |
| created_at     | DateTime | Upload timestamp |
| updated_at     | DateTime | Last update timestamp |

---

## 🧠 ChromaDB Collection

| Field         | Type       | Description |
|:--------------|:-----------|:------------|
| document      | Text        | Chunk of PDF text |
| embedding     | Vector(384) | Embedding vector |
| metadata      | JSON        | (Optional) Chunk info |

---

## ⚙️ Important Backend Utilities

| File                        | Functions |
|:-----------------------------|:----------|
| `utils/pdf_reader.py`        | `extract_text_from_pdf(filepath)` |
| `utils/vector_store.py`      | `store_in_chroma(chunks)` <br> `query_chroma(question_embedding)` |
| `utils/conversational_chain.py` | `generate_answer(question, retrieved_chunks)` |

---

## 🚀 Technology Stack

| Layer         | Technology |
|:--------------|:-----------|
| Frontend      | React.js + TailwindCSS |
| Backend       | FastAPI |
| Embedding     | SentenceTransformer (`all-MiniLM-L6-v2`) |
| NLP Model     | Transformers & Ollama Mistral |
| Vector DB     | ChromaDB |
| Relational DB | SQLite |
| Hosting       | Vercel (frontend) + Railway / Render (backend) |

---

## 📈 Improvements for Future

- 🔒 Add authentication (user accounts)
- 🧠 Allow model selection (choose between local or API models)
- 📚 Multi-document search
- 🖍️ Highlight exact sources in document
- 🕓 Save and view previous question-answer history
- 📤 Export chat conversations

---

