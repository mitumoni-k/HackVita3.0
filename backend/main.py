import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import uuid

session_context = {}  # To store context for each session

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Google Gemini API
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Ensures POST is allowed
    allow_headers=["*"],
)

# Request Models
class QuizRequest(BaseModel):
    topic: str
    difficulty: str

class ExplanationRequest(BaseModel):
    question: str
    answer: str

class ScoreRequest(BaseModel):
    user_answers: list

class StudyHelpRequest(BaseModel):
    message: str 

# 1️⃣ Generate Quiz
@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    print("📩 Received Request:", request.dict())  # ✅ Debugging

    prompt = (
    f"Generate 10 multiple-choice questions for {request.topic} at {request.difficulty} difficulty. "
    "Provide the response in raw JSON format (no markdown, no extra text) with the following structure:\n"
    "{\n"
    '  "questions": [\n'
    '    {\n'
    '      "id": "unique_question_id",\n'
    '      "question": "The actual question text?",\n'
    '      "options": ["option1", "option2", "option3", "option4"],\n'
    '      "correctAnswer": "Correct option text",\n'
    '      "explanation": "Brief explanation of the correct answer."\n'
    '    },\n'
    "    ... (repeat for 10 questions) ...\n"
    "  ]\n"
    "}"
)


    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        print("📜 Generated Response:", response.text)  # ✅ Debugging

        # ✅ Remove Markdown formatting (if present)
        clean_json = response.text.strip().replace("json", "").replace("", "").strip()

        # ✅ Parse the JSON response
        quiz_data = json.loads(clean_json)

        return quiz_data  # ✅ Return structured JSON
    except json.JSONDecodeError as json_err:
        print("❌ JSON Parsing Error:", str(json_err))  # ✅ Debugging
        raise HTTPException(status_code=500, detail="Invalid JSON format from AI response.")
    except Exception as e:
        print("❌ Error:", str(e))  # ✅ Debugging
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summary-insights")
async def study_help(request: StudyHelpRequest):
    prompt = (
    "You are a focused quiz evaluator. A student has completed a quiz, and you are here to provide a concise summary. "
    f"Based on the student's performance on the following topics: \"{request.message}\", "
    "briefly identify their strong and weak areas. Suggest quick and actionable steps for improvement. "
    "Keep your response short, clear, and helpful. Respond in plain text with no markdown."
)
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        help_text = response.text.strip().replace("", "").strip()
        return {"help": help_text}
    except Exception as e:
        print("Error generating study help:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/study-help")
async def study_help(request: StudyHelpRequest):
    prompt = (
    "You are a helpful study guide. A student asks: "
    f"\"{request.message}\". "
    "Provide a concise, clear, and actionable answer for learning or revising the topic. "
    "Respond in plain text with no markdown."
)
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        help_text = response.text.strip().replace("", "").strip()
        return {"help": help_text}
    except Exception as e:
        print("Error generating study help:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai-tutor")
async def study_help(request: StudyHelpRequest):
    prompt = (
    "You are an AI tutor helping a student achieve their learning goals. "
    f"Based on the student's input: \"{request.message}\", "
    "analyze their strengths, weaknesses, and planned actions. "
    "Provide a clear, concise study plan with prioritized topics, effective study techniques, and actionable steps to address weaknesses. "
    "Keep the response brief and straightforward in plain text."
    "Respond in plain text with no markdown."
)

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        help_text = response.text.strip().replace("```", "").strip()
        return {"help": help_text}
    except Exception as e:
        print("Error generating study help:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Run the API with Uvicorn
if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)