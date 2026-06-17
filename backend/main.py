from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from services.transcript import get_transcript
from services.summary import generate_summary
from services.youtube_utils import extract_video_id
from services.learning_content import generate_learning_content

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is working!"}


@app.get("/transcript")
def transcript(video_url: str):
    try:
        video_id = extract_video_id(video_url)

        transcript_text = get_transcript(video_id)

        return {
            "success": True,
            "video_id": video_id,
            "transcript": transcript_text
        }
    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }




@app.get("/summary")
def summary(video_url: str):

    try:

        video_id = extract_video_id(video_url)

        transcript_text = get_transcript(video_id)

        summary_text = generate_summary(transcript_text)

        return {
            "success": True,
            "video_id": video_id,
            "summary": summary_text
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
    

@app.get("/analyze")
def analyze(video_url: str):

    try:

        video_id = extract_video_id(video_url)

        transcript_text = get_transcript(video_id)

        learning_content = generate_learning_content(
            transcript_text
        )

        return {
            "success": True,
            "video_id": video_id,
            "data": learning_content
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }