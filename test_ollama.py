import ollama

response = ollama.chat(
    model="llama3.2:3b",
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