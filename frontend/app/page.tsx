"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeVideo = async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      "http://127.0.0.1:8000/analyze",
      {
        params: {
          video_url: videoUrl,
        },
      }
    );

    setResult(response.data);
  } catch (error) {
    alert("Error analyzing video");
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8">YouTube Learning Assistant</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border p-3 rounded w-full max-w-2xl"
      />

      <button
        className="mt-4 px-6 py-3 bg-black text-white rounded"
        onClick={analyzeVideo}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Video"}
      </button>

      {result && result.success && (
        <div className="mt-10 w-full max-w-4xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Summary</h2>
            <p>{result.data.summary}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Study Notes</h2>
            <ul className="list-disc pl-5">
              {result.data.study_notes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Key Concepts</h2>
            <ul className="list-disc pl-5">
              {result.data.key_concepts.map(
                (concept: string, index: number) => (
                  <li key={index}>{concept}</li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Important Terms</h2>
            <ul className="list-disc pl-5">
              {result.data.important_terms.map(
                (term: string, index: number) => (
                  <li key={index}>{term}</li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Quiz Questions</h2>

            {result.data.quiz_questions.map(
              (
                quiz: {
                  question: string;
                  answer: string;
                },
                index: number,
              ) => (
                <div key={index} className="border p-4 rounded mb-3">
                  <p>
                    <strong>Q:</strong> {quiz.question}
                  </p>

                  <p>
                    <strong>A:</strong> {quiz.answer}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </main>
  );
}
