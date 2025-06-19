from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_core.messages import HumanMessage, AIMessage

from src.langgraphnodes.LLMS.groqllm import GroqLLM
from src.langgraphnodes.graph.graph_builder import GraphBuilder
from pathlib import Path
import json

app = FastAPI(title="Simple LLM API")

# =============================================================================
# 1. DATA MODELS
# =============================================================================


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    api_key: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str


# =============================================================================
# 2. CONFIGURATION LOADER
# =============================================================================


class ConfigLoader:
    def __init__(self, config_dir: str = "config"):
        self.config_dir = Path(config_dir)
        self.providers = {}
        self.models = {}
        self.use_cases = {}
        self.load_all_configs()

    def load_all_configs(self):
        """Load all configuration files"""
        try:
            self.providers = self.load_json("providers.json")
            self.models = self.load_json("models.json")
            self.use_cases = self.load_json("use_cases.json")
            print("✅ All configurations loaded successfully")
        except Exception as e:
            print(f"❌ Error loading configurations: {e}")
            # Create default configs if files don't exist
            self.create_default_configs()

    def load_json(self, filename: str) -> dict:
        """Load JSON configuration file"""
        file_path = self.config_dir / filename
        if file_path.exists():
            with open(file_path, "r") as f:
                return json.load(f)
        else:
            print(f"Warning: {filename} not found, using defaults")
            return {}

    def create_default_configs(self):
        """Create default configuration files"""
        self.config_dir.mkdir(exist_ok=True)

        # Default providers
        if not self.providers:
            self.providers = {
                "openai": {
                    "name": "OpenAI",
                    "description": "Industry-leading GPT models",
                    "api_base_url": "https://api.openai.com/v1",
                    "requires_api_key": True,
                    "api_key_format": "sk-...",
                },
                "groq": {
                    "name": "Groq",
                    "description": "Ultra-fast inference",
                    "api_base_url": "https://api.groq.com/openai/v1",
                    "requires_api_key": True,
                    "api_key_format": "gsk_...",
                },
                "gemini": {
                    "name": "Google Gemini",
                    "description": "Google's multimodal AI",
                    "api_base_url": "https://generativelanguage.googleapis.com/v1",
                    "requires_api_key": True,
                    "api_key_format": "AI...",
                },
                "ollama": {
                    "name": "Ollama",
                    "description": "Run models locally",
                    "api_base_url": "http://localhost:11434",
                    "requires_api_key": False,
                    "api_key_format": "No API key required",
                },
            }
            self.save_json("providers.json", self.providers)

        # Default models per provider
        if not self.models:
            self.models = {
                "openai": [
                    {
                        "id": "gpt-4-turbo-preview",
                        "name": "GPT-4 Turbo",
                        "max_tokens": 4096,
                        "context_window": 128000,
                    },
                    {
                        "id": "gpt-3.5-turbo",
                        "name": "GPT-3.5 Turbo",
                        "max_tokens": 4096,
                        "context_window": 16385,
                    },
                ],
                "groq": [
                    {
                        "id": "llama3-70b-8192",
                        "name": "Llama3 70B",
                        "max_tokens": 8192,
                        "context_window": 8192,
                    },
                    {
                        "id": "mixtral-8x7b-32768",
                        "name": "Mixtral 8x7B",
                        "max_tokens": 32768,
                        "context_window": 32768,
                    },
                ],
                "gemini": [
                    {
                        "id": "gemini-pro",
                        "name": "Gemini Pro",
                        "max_tokens": 8192,
                        "context_window": 32768,
                    }
                ],
                "ollama": [
                    {
                        "id": "llama2",
                        "name": "Llama2 7B",
                        "max_tokens": 2048,
                        "context_window": 4096,
                    },
                    {
                        "id": "codellama",
                        "name": "Code Llama",
                        "max_tokens": 2048,
                        "context_window": 4096,
                    },
                ],
            }
            self.save_json("models.json", self.models)

        # Default use cases
        if not self.use_cases:
            self.use_cases = {
                "basic_chatbot": {
                    "name": "Basic Chatbot",
                    "description": "General purpose AI assistant",
                    "system_prompt": "You are a helpful AI assistant. Provide clear, accurate responses.",
                    "temperature": 0.7,
                    "max_tokens": 1000,
                },
                "code_assistant": {
                    "name": "Code Assistant",
                    "description": "Programming help and code review",
                    "system_prompt": "You are an expert programming assistant. Help with coding problems and best practices.",
                    "temperature": 0.3,
                    "max_tokens": 2000,
                },
                "content_writer": {
                    "name": "Content Writer",
                    "description": "Create and edit written content",
                    "system_prompt": "You are a skilled content writer. Create engaging, well-structured content.",
                    "temperature": 0.8,
                    "max_tokens": 2000,
                },
                "translator": {
                    "name": "Translator",
                    "description": "Translate between languages",
                    "system_prompt": "You are a professional translator. Provide accurate, natural translations.",
                    "temperature": 0.3,
                    "max_tokens": 1000,
                },
            }
            self.save_json("use_cases.json", self.use_cases)

    def save_json(self, filename: str, data: dict):
        """Save configuration to JSON file"""
        file_path = self.config_dir / filename
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
        print(f"✅ Created {filename}")


# Initialize configuration loader
config = ConfigLoader()

# =============================================================================
# 3. SIMPLE API ENDPOINTS
# =============================================================================


@app.get("/api/providers")
async def get_providers():
    """Get all available providers"""
    return config.providers


@app.get("/api/providers/{provider_id}/models")
async def get_models(provider_id: str):
    """Get models for specific provider"""
    if provider_id not in config.models:
        raise HTTPException(status_code=404, detail="Provider not found")
    return config.models[provider_id]


@app.get("/api/use-cases")
async def get_use_cases():
    """Get all use cases"""
    return config.use_cases


@app.get("/api/config")
async def get_complete_config():
    """Get complete configuration for frontend"""
    return {
        "providers": config.providers,
        "models": config.models,
        "use_cases": config.use_cases,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Simple chat endpoint
    """
    try:
        # Setup with minimal config
        user_controls = {
            "selected_llm": "Groq",
            "selected_groq_model": "llama3-8b-8192",  # Default model
            "GROQ_API_KEY": request.api_key,
            "selected_usecase": "Basic Chatbot",
        }

        # Initialize LLM
        obj_llm_config = GroqLLM(user_controls_input=user_controls)
        model = obj_llm_config.get_llm_model()

        if not model:
            raise HTTPException(status_code=500, detail="Failed to initialize LLM")

        # Build graph
        graph_builder = GraphBuilder(model)
        graph = graph_builder.setup_graph("Basic Chatbot")

        # Convert history to LangChain messages
        messages = []
        for msg in request.history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))

        # Add current message
        messages.append(HumanMessage(content=request.message))

        # Get response
        result = graph.invoke({"messages": messages})

        # Extract AI response
        if "messages" in result:
            for msg in reversed(result["messages"]):
                if isinstance(msg, AIMessage):
                    return ChatResponse(response=msg.content)

        raise HTTPException(status_code=500, detail="No response generated")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
