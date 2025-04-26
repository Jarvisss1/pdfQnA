import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
import os

# Initialize the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Setup ChromaDB client and collection
# Use persistent client for consistency with conversational_chain.py
persist_directory = "./chroma"  # Match the directory used in conversational_chain.py
os.makedirs(persist_directory, exist_ok=True)
chroma_client = chromadb.PersistentClient(path=persist_directory)

# In Chroma v0.6.0, list_collections returns only names
print("🔗 All collections before init:", chroma_client.list_collections())

# Create or get the collection
collection = chroma_client.get_or_create_collection(
    name="langchain",  # Using "langchain" to match what LangChain uses by default
    embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
)
print("✅ Using collection:", collection.name)

# Get collection names directly - don't try to access name attribute
print("🔗 All collections after init:", chroma_client.list_collections())

# Add to Chroma
def add_to_vector_store(chunks):
    try:
        # Get current count to generate ids
        count = collection.count()
        
        # Create batch-ready arrays
        ids = []
        for i, chunk in enumerate(chunks):
            # Debug: show chunk being added
            print(f"➕ Adding chunk[{i}]: {chunk[:50]}...")
            # Generate unique id
            next_id = f"doc_{count + i}"
            ids.append(next_id)
        
        # Add all chunks at once for better performance
        collection.add(
            documents=chunks,
            ids=ids
        )
        print(f"✅ Added {len(chunks)} chunks to vector DB")
        
        # Debug: print diagnostics after add
        new_count = collection.count()
        print(f"📦 Document count: {new_count}")
        
        # Get a sample to verify data is stored properly
        if new_count > 0:
            sample = collection.get(limit=3, include=["documents", "embeddings"])
            print("📦 Sample documents:", [doc[:50] + "..." for doc in sample["documents"]])
            print("🔢 Sample embedding dimensions:", [len(emb) for emb in sample["embeddings"]])
            
    except Exception as e:
        print(f"❌ Error adding to vector store: {str(e)}")

# Search Chroma
def search(query, top_k=5):
    try:
        print(f"🔍 Running query: {query}")
        # Perform similarity search
        results = collection.query(query_texts=[query], n_results=top_k)
        
        # Debug: show collection size
        count = collection.count()
        print(f"📚 Total documents in collection: {count}")
        
        # Flatten the result
        flattened = [doc for doc_list in results["documents"] for doc in doc_list]
        print(f"🔍 Retrieved {len(flattened)} chunks for query")
        return flattened
    except Exception as e:
        print(f"❌ Error searching: {str(e)}")
        return []

# For accessing the collection from other modules
def get_collection():
    return collection

# For diagnostic purposes
def print_collection_info():
    try:
        count = collection.count()
        print(f"📊 Collection '{collection.name}' contains {count} documents")
        
        if count > 0:
            # Get sample documents with valid include parameters
            sample = collection.get(limit=3, include=["documents", "embeddings"])
            print(f"📄 Sample document count: {len(sample['documents'])}")
            
            # Print first few characters of each document
            for i, doc in enumerate(sample["documents"][:3]):
                print(f"  Document {i}: {doc[:100]}...")
                
    except Exception as e:
        print(f"❌ Error printing collection info: {str(e)}")

# If called directly, show collection info
if __name__ == "__main__":
    print_collection_info()