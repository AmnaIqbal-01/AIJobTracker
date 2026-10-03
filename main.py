from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File, HTTPException
import pytesseract
from PIL import Image
import ollama
import sqlite3
import json


app = FastAPI()

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class JobStatusUpdate(BaseModel):
    status: str


@app.post("/api/login")
def login(data: LoginRequest):
    if data.email == "test@example.com" and data.password == "123456":
        return {
            "success": True,
            "message": "Login successful!"
        }

    return {
        "success": False,
        "message": "Invalid email or password"
    }


@app.post("/api/upload-job")
async def upload_job(screenshot: UploadFile = File(...)):

    # 1. Read image
    image = Image.open(screenshot.file)

    # 2. OCR
    text = pytesseract.image_to_string(image)

    # 3. Send OCR text to Ollama
    job_data = extract_job_data(text)

    # 4. Save to database
    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO jobs (company, position, location, job_type, salary, skills, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        job_data.get("company"),
        job_data.get("position"),
        job_data.get("location"),
        job_data.get("job_type"),
        job_data.get("salary"),
        ", ".join(job_data.get("skills") or []),
        job_data.get("status") or "applied"
    ))

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": screenshot.filename,
        "text": text,
        "job_data": job_data
    }


@app.get("/api/jobs")
def get_jobs():

    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM jobs ORDER BY id DESC")

    jobs = cursor.fetchall()

    connection.close()

    return {
        "success": True,
        "jobs": jobs
    }


@app.patch("/api/jobs/{job_id}")
def update_job_status(job_id: int, data: JobStatusUpdate):
    connection = sqlite3.connect("jobs.db")
    try:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE jobs SET status = ? WHERE id = ?",
            (data.status, job_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        connection.commit()
    finally:
        connection.close()

    return {"success": True, "message": "Job status updated"}


def extract_job_data(text):

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {
                "role": "user",
                "content": f"""
Extract job information from this job posting.

Return ONLY a valid JSON object.
Do not write any explanation.
Do not use markdown.
Do not use ```json.
Do not write anything before or after the JSON.

Use exactly these fields:

{{
    "company": null,
    "position": null,
    "location": null,
    "job_type": null,
    "salary": null,
    "skills": null
}}

Rules:
1. NEVER guess or invent information.
2. Only extract information that is clearly present in the job posting.
3. If information is missing or unclear, use null.
4. For salary:
   - Only include a salary if an actual salary amount or salary range is clearly written.
   - Do NOT interpret random numbers, IDs, dates, experience requirements, or OCR errors as salary.
   - If there is no clearly stated salary, return null.
   - only pick values which are clearly stated as salary in the posting. Do not make assumptions or guesses.
   - only pick values which have currency sign with them
   
5. For company:
   - Only use a company name if it is clearly identifiable.
   - Do not use a job title as the company.
6. For location:
   - Only use a location explicitly mentioned in the posting.
7. For job_type:
   - Only use values such as Full-time, Part-time, Contract, Internship, etc. when clearly stated.
8. For skills:
   - Only include technologies, programming languages, frameworks, tools, or clearly stated professional skills.
   - Do not include random words from the posting.
9. Do not make assumptions.
10. Do not add explanations or markdown.

Job posting:
{text}
"""
            }
        ],
        format ="json"
    )

    result = response["message"]["content"]
    print("Ollama response::")
    print(result)
    print("End of Ollama response::")

    return json.loads(result)


def create_database():

    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT,
            position TEXT,
            location TEXT,
            job_type TEXT,
            salary TEXT,
            skills TEXT,
            status TEXT DEFAULT 'applied'
        )
    """)

    connection.commit()
    connection.close()


create_database()