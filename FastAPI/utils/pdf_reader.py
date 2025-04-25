import PyPDF2
from langchain.text_splitter import CharacterTextSplitter
from typing import List

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def chunk_text(text, chunk_size=1000):
    # words = text.split()
    # return [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=chunk_size,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks
