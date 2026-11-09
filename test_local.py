"""FastAPI local server for the Qwen + LoRA adapter.

Run:
    pip install fastapi "uvicorn[standard]" torch transformers peft safetensors
    python test_local.py

The Vue app can then call POST http://localhost:8000/api/chat.
"""

from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from peft import PeftModel
from pydantic import BaseModel, Field
from transformers import AutoModelForCausalLM, AutoTokenizer

BASE_MODEL_ID = "Qwen/Qwen3-0.6B"
ADAPTER_DIR = Path(r"C:\Users\Admin\Downloads\results\opencoder_vi3995_api\opencoder_vi3995_001\best_adapter")
SYSTEM_PROMPT = (
    "Bạn là trợ lý lập trình Python. Trả lời bằng tiếng Việt. "
    "Hãy giải thích lỗi, đưa code đã sửa và viết test khi phù hợp."
)

tokenizer = None
model = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10_000)
    code: str = Field(default="", max_length=50_000)


class ChatResponse(BaseModel):
    answer: str


def load_model() -> None:
    """Load the base model and LoRA adapter once, when the server starts."""
    global model, tokenizer

    for filename in ("adapter_config.json", "adapter_model.safetensors"):
        if not (ADAPTER_DIR / filename).is_file():
            raise FileNotFoundError(f"Không tìm thấy {filename} trong {ADAPTER_DIR}")

    print("Đang tải Qwen3-0.6B và adapter...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(ADAPTER_DIR)
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_ID,
        torch_dtype=torch.float32,
    )
    model = PeftModel.from_pretrained(base_model, ADAPTER_DIR)
    model.eval()
    print("Model đã sẵn sàng tại http://localhost:8000", flush=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    load_model()
    yield


app = FastAPI(title="CodeMate local AI API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, bool]:
    return {"ready": model is not None}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model đang khởi động. Hãy thử lại sau.")

    user_content = request.message
    if request.code.strip():
        user_content = f"{user_content}\n\nCode:\n{request.code}"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]
    prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=False,
    )
    inputs = tokenizer(prompt, return_tensors="pt", add_special_tokens=False)

    with torch.inference_mode():
        output = model.generate(
            **inputs,
            max_new_tokens=384,
            do_sample=False,
        )

    generated_tokens = output[0, inputs["input_ids"].shape[1] :]
    answer = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()
    return ChatResponse(answer=answer or "Model chưa tạo được câu trả lời.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("test_local:app", host="127.0.0.1", port=8000, reload=False)
