import json
import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_learning_content(transcript):

    prompt = f"""
Analyze the following YouTube transcript.

Return ONLY valid JSON.

Format:

{{
    "summary": "...",

    "study_notes": [
        "...",
        "...",
        "..."
    ],

    "key_concepts": [
        "...",
        "..."
    ],

    "important_terms": [
        "...",
        "..."
    ],

    "quiz_questions": [
        {{
            "question": "...",
            "answer": "..."
        }}
    ]
}}

Generate:

1. A concise summary.
2. Study notes in bullet-point style.
3. Key concepts discussed.
4. Important terms.
5. Five quiz questions with answers.

Return ONLY valid JSON.
Do not include markdown.
Do not wrap the JSON in ```json blocks.

Transcript:
{transcript}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return json.loads(text)