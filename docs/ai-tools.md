# AI Tools, Platforms, and Libraries (Curated)

This file lists well-known AI platforms, frameworks, libraries, agent toolkits, vector stores, and monitoring/evaluation tools. It is a curated starter list — not exhaustive — and includes short notes on typical use-cases.

---

## Model providers / APIs
- OpenAI (GPT family, function-calling): general-purpose text, code, and multimodal. Widely used for chat, few-shot, and production APIs.
- Anthropic (Claude): assistant-style models optimized for helpfulness and safety.
- Google Vertex AI / PaLM: large models and managed endpoints on Google Cloud.
- Cohere: text generation and embeddings.
- Mistral, Aleph Alpha, Stability AI: open and research-focused model providers.
- Local LLMs: Llama (Meta), Llama 2, Llama 3 variants — frequently used via Hugging Face or local runtimes for fine-tuning and inference.


## Frameworks & model runtimes
- Hugging Face Transformers & Hub — model zoo & SDK for many model families.
- PyTorch / TensorFlow / JAX — primary ML frameworks.
- ONNX Runtime — optimized cross-framework runtime.
- Accelerate / BitsAndBytes — tools for efficient large-model serving / quantization.


## Agents & orchestration
- LangChain — orchestration and prompt templates, connectors for documents, chains, and tools.
- LlamaIndex (formerly GPT Index) — focused on indexing and retrieval for RAG workflows.
- Haystack — search & RAG with pipelines and retrievers.
- AutoGPT / BabyAGI-style agents — experiment-grade agents that orchestrate steps autonomously.


## Retrieval & vector stores
- FAISS — in-memory vector index (Facebook). Often embedded in apps for nearest-neighbor search.
- Pinecone — managed vector DB service.
- Milvus — open-source vector database for scale.
- Weaviate — vector DB with schema-based semantic search and modules.
- Chroma — developer-friendly local vector DB.


## Tooling for prompt engineering and observability
- LangSmith, PromptLayer — prompt/test tracing and observability for prompt interactions.
- Weights & Biases, MLflow — experiment tracking and model metrics.
- OpenAI Evals — evaluation harness for model behaviors and benchmarks.
- `promptsource` — community prompt collection for dataset-centric prompting.


## Evaluation & benchmarking
- HELM, LM-eval-harness — model benchmarking suites.
- Custom pytest-based evaluation scripts — often used to assert behavior on regressions.


## Deployment & serving
- Docker, Kubernetes — containerization & orchestration.
- Ray Serve, TorchServe — scalable model serving.
- Hugging Face Inference Endpoints, AWS SageMaker, Azure ML — managed model hosting.


## Safety, filtering, and content moderation
- OpenAI / Perspective API / custom classifiers — content moderation solutions.
- ClamAV / file scanning — for uploaded files in ingestion pipelines (basic virus scan).


## Notes & recommendations
- For RAG: combine a vector store (FAISS, Pinecone) + retrieval pipeline (LlamaIndex or LangChain) + a LLM with conservative temperature and cite sources.
- For production: add monitoring (Latencies, error rate), prompt/version control, and automated evaluation checks in CI.


---

Path: `docs/ai-tools.md`
