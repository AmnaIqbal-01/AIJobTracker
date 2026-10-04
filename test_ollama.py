import ollama
from settings import LLM_MODEL

response = ollama.chat(
    model=LLM_MODEL,
    messages=[
        {
            "role": "user",
            "content": """
Extract job information from this text.

Text:

We are hiring a Junior Data Engineer in Lahore.

The company is ABC Technologies.

This is a full-time position.

Return ONLY JSON with these fields:

company
position
location
job_type
"""
        }
    ]
)

print(response["message"]["content"])