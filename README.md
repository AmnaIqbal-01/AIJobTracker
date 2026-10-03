# AI Job Tracker

An AI-powered job application tracker built with **React, FastAPI, SQLite, OCR, and Ollama**.

Upload a screenshot of a job posting and the app uses OCR and local AI to extract job details and save them to the database.

## Features

* Upload job screenshots
* Extract job details using OCR
* Local AI extraction with Ollama
* Store jobs in SQLite
* Search and filter jobs
* Update application status

## Tech Stack

* React + Vite
* FastAPI
* Python
* SQLite
* Tesseract OCR
* Ollama (`llama3.2:3b`)

## Requirements

Install these before running the project:

* Python 3.10+
* Node.js
* npm
* Tesseract OCR
* Ollama
* Git

---

## 1. Clone the Project

```bash
Clone the repo
cd AIJobTracker
```

---

## 2. Install Tesseract OCR

Download and install Tesseract OCR:

https://github.com/tesseract-ocr/tesseract

After installation, make sure Tesseract is available on your system.

On Windows, the default path is usually:

```text
C:\Program Files\Tesseract-OCR\tesseract.exe
```

If your installation uses a different path, update the path in `main.py`.

---

## 3. Install Ollama

Download and install Ollama:

https://ollama.com/

After installing, open PowerShell or Command Prompt and run:

```bash
ollama pull llama3.2:3b
```

Check that the model is installed:

```bash
ollama list
```

You should see:

```text
llama3.2:3b
```

Ollama runs the AI model locally, so you don't need an OpenAI or Gemini API key.

---

## 4. Backend Setup

Open a terminal in the project folder:

```bash
cd AIJobTracker
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install fastapi uvicorn python-multipart pytesseract pillow python-dotenv ollama
```

If the project contains a `requirements.txt` file, you can install everything with:

```bash
pip install -r requirements.txt
```

---

## 5. Start the Backend

Make sure your virtual environment is activated.

Run:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

You can also open the FastAPI documentation at:

```text
http://127.0.0.1:8000/docs
```

Keep this terminal running.

---

## 6. Frontend Setup

Open a **new terminal**.

Go to the frontend folder:

```bash
cd AIJobTracker/frontend
```

Install the Node dependencies:

```bash
npm install
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd install
```

---

## 7. Start the Frontend

From the `frontend` folder, run:

```bash
npm run dev
```

If PowerShell blocks npm, use:

```bash
npm.cmd run dev
```

Vite will show a local address, usually:

```text
http://localhost:5173
```

Open that address in your browser.

---

## 8. Running the Project

You need **two terminals** running at the same time.

### Terminal 1 — Backend

```bash
cd AIJobTracker
venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```bash
cd AIJobTracker/frontend
npm.cmd run dev
```

Then open:

```text
http://localhost:5173
```

---

## 9. Using the Application

1. Open the frontend in your browser.
2. Go to **Add Job**.
3. Upload a screenshot of a job posting.
4. The backend sends the image through Tesseract OCR.
5. The extracted text is sent to the local Ollama AI model.
6. Ollama extracts the job information.
7. The job is saved in SQLite.
8. View the job from the dashboard.
9. Search/filter jobs and update their application status.

---

## Project Structure

```text
AIJobTracker/
│
├── main.py
├── jobs.db
├── venv/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Database

The project uses **SQLite**, so no separate database server is required.

The database file is:

```text
jobs.db
```

It is created/used by the FastAPI backend.

## AI Model

This project uses:

```text
llama3.2:3b
```

through Ollama.

Because Ollama runs locally, the job posting information is processed using a local AI model rather than requiring a cloud AI API key.

## Troubleshooting

### Ollama model not found

Run:

```bash
ollama pull llama3.2:3b
```

Then check:

```bash
ollama list
```

### Tesseract not found

Make sure Tesseract is installed and that the path in `main.py` points to:

```text
C:\Program Files\Tesseract-OCR\tesseract.exe
```

### Backend won't start

Make sure the virtual environment is activated:

```bash
venv\Scripts\activate
```

Then install the dependencies:

```bash
pip install -r requirements.txt
```

### Frontend won't start

Go to the frontend folder:

```bash
cd frontend
```

Then:

```bash
npm install
npm run dev
```

On Windows PowerShell, use:

```bash
npm.cmd install
npm.cmd run dev
```

## License

This project is for learning and personal use.
