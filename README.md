# RAGify 🚀

RAGify is a modern, production-ready, multi-tenant Customer Support Automation platform. It allows organizations (tenants) to upload their company knowledge bases (PDF, DOCX, TXT manuals) and instantly deploy a customized, public-facing chatbot widget that answers customer queries grounded strictly in the provided documents.

---

## 🛠️ System Architecture

RAGify utilizes a dual-microservice backend architecture to separate web administrative routing from high-performance machine learning operations.

```
                  +-------------------------+
                  |  Vite + React Frontend  |
                  +------------+------------+
                               |
                        (HTTP / JWT Auth)
                               v
                  +------------+------------+
                  |    Node/Express Server  | <---> MongoDB (Atlas)
                  +------------+------------+ <---> Cloudinary (File Storage)
                               |
                     (Internal API Key Auth)
                               v
                  +------------+------------+
                  | Python FastAPI Service  | <---> Pinecone (Vector Index)
                  +-------------------------+ <---> Hugging Face Hub (Qwen 2.5)
```

1. **Client**: Built with **React 19**, **Vite**, and **TailwindCSS v4**, featuring a premium translucent dark glass interface with responsive hamburger navigation and full-screen drawer overlays on mobile.
2. **API Gateway (server)**: A **Node.js + Express** server handling tenant authentication (JWT), metadata storage (MongoDB via Mongoose), file uploads (Multer + Cloudinary), and statistics logging.
3. **RAG Service (zrag-service)**: A high-performance **FastAPI** Python microservice orchestrating document parsing, character chunking, and context-grounded LLM inference. Rather than hosting heavy model weights locally (which demands gigabytes of RAM), it queries the **Hugging Face Serverless Inference API** for embeddings (`all-MiniLM-L6-v2`) and text generation (`Qwen-2.5-Instruct`), keeping the active footprint below 150MB RAM (perfectly fitting within free hosting tiers like Render's 512MB limit).

---

## 📂 Repository Structure

```
RAGify/
├── client/              # React 19 Frontend
│   ├── src/
│   │   ├── components/  # Layout, UI Primitives, and Chat elements
│   │   ├── context/     # JWT Auth Context Providers
│   │   ├── pages/       # Dashboard, Upload Panel, Auth, Landing, & Chat
│   │   └── services/    # Client HTTP request hooks
│   └── package.json
│
├── server/              # Node.js + Express API Gateway
│   ├── src/
│   │   ├── config/      # Cloudinary and Mongoose DB initialization
│   │   ├── controllers/ # Auth, Chat, Document, and Dashboard endpoints
│   │   ├── models/      # Mongoose Schemas (User, Org, Doc, Visitor, Chat)
│   │   └── services/    # External API links (Cloudinary, RAG microservice)
│   └── package.json
│
└── zrag-service/        # Python + FastAPI RAG Processor
    ├── app/
    │   ├── routes/      # Ingestion, Answer matching, and Deletion endpoints
    │   ├── schemas/     # Pydantic input validation models
    │   └── services/    # PDF/DOCX extractors, Pinecone link, HF inference
    └── requirements.txt
```

---

## ⚙️ Environment Configuration

To run RAGify, you need to configure separate environment files for both backend services.

### 1. Node Gateway config (`server/.env`)
Create `server/.env` file:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAG_SERVICE_URL=http://localhost:8000
RAG_SERVICE_API_KEY=your_secure_internal_shared_secret
```

### 2. RAG Microservice config (`zrag-service/.env`)
Create `zrag-service/.env` file:
```env
PORT=8000
INTERNAL_API_KEY=your_secure_internal_shared_secret
HUGGINGFACE_API_KEY=your_hugging_face_token
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=ragify
MIN_MATCH_SCORE=0.35
```

---

## 🚀 Local Installation & Execution

Follow these steps to run all three layers concurrently.

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)
* **MongoDB** (Atlas cluster or local service)
* **Pinecone** (A vector index named `ragify` configured for `384` dimensions with cosine metric matching)

### Step 1: Run the RAG Microservice (`zrag-service`)
1. Open a terminal and navigate to the directory:
   ```bash
   cd zrag-service
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

### Step 2: Run the API Gateway (`server`)
1. Open a second terminal and navigate to the directory:
   ```bash
   cd server
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the node server:
   ```bash
   npm run dev
   ```

### Step 3: Run the React Web App (`client`)
1. Open a third terminal and navigate to the directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite bundler dev server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## 💡 core Workflows

### 1. Document Ingestion Loop
* **Multer -> Cloudinary**: Files uploaded by workspace managers are sent to Cloudinary as raw assets.
* **FastAPI Pipeline**: The node server requests `/api/ingest`. The RAG microservice fetches the raw file, extracts text (via `PdfReader` or `mammoth`), chunks text using `RecursiveCharacterTextSplitter` (300 characters, 50 overlap), embeds them using Hugging Face's `all-MiniLM-L6-v2`, and upserts to Pinecone isolated under the tenant's namespace.

### 2. Retrieval QA Loop
* **Semantic Filter**: Visitor questions are embedded and matched against vectors filtered strictly on the metadata field `organizationId`.
* **Synthesis**: Matches score-checked against `MIN_MATCH_SCORE`. Valid contexts are compiled into a prompt, and the `Qwen2.5-7B-Instruct` model synthesizes a customer support answer strictly aligned with matching documents.
