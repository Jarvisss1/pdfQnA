import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer

# SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Setup ChromaDB
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(
    name="pdf_embeddings",
    embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
)

# Add to Chroma
def add_to_vector_store(chunks):
    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            ids=[f"doc_{len(collection.get()['ids']) + i}"]  # Ensure unique ids
        )
    print(f"✅ Added {len(chunks)} chunks to vector DB")



# Search Chroma
# Search Chroma
def search(query, top_k=5):
    results = collection.query(query_texts=[query], n_results=top_k)
    # Flatten the list of documents
    return [doc for doc_list in results["documents"] for doc in doc_list]
