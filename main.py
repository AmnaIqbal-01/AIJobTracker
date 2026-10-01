from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File
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

    cursor.execute("SELECT * FROM jobs")

    jobs = cursor.fetchall()

    connection.close()

    return {
        "success": True,
        "jobs": jobs
    }


def extract_job_data(text):

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {
                "role": "user",
                "content": f"""
Extract job information from the following job posting text.

Return ONLY valid JSON with these fields:

company
position
location
job_type
salary
skills

If information is not available, use null.

For skills, return a JSON array.

Job posting text:

{text}
"""
            }
        ]
    )

    result = response["message"]["content"]

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