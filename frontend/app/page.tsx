"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<number[]>([]);

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
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold mb-4">
        YouTube Learning Assistant
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        Turn any YouTube video into study notes, concepts, and quizzes.
      </p>

      <input
        type="text"
        placeholder="Paste YouTube URL..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border bg-white p-3 rounded-lg w-full max-w-2xl shadow"
      />

      <div className="flex gap-3 mt-4">
        <button
          className="px-6 py-3 bg-black text-white rounded-lg"
          onClick={analyzeVideo}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Video"}
        </button>

        <button
          className="px-6 py-3 border rounded-lg bg-white"
          onClick={() => {
            setVideoUrl("");
            setResult(null);
          }}
        >
          Clear
        </button>
      </div>

      {result && result.success && (
        <div className="mt-10 w-full max-w-5xl space-y-6">

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">
              Summary
            </h2>
            <p>{result.data.summary}</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">
              Study Notes
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              {result.data.study_notes.map(
                (note: string, index: number) => (
                  <li key={index}>{note}</li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">
              Key Concepts
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              {result.data.key_concepts.map(
                (concept: string, index: number) => (
                  <li key={index}>{concept}</li>
                )
              )}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">
              Important Terms
            </h2>

            <div className="flex flex-wrap gap-2">
              {result.data.important_terms.map(
                (term: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full"
                  >
                    {term}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
  <h2 className="text-2xl font-bold mb-3">
    Quiz Questions
  </h2>

  {result.data.quiz_questions.map(
    (
      quiz: {
        question: string;
        answer: string;
      },
      index: number
    ) => (
      <div
        key={index}
        className="border rounded-lg p-4 mb-3"
      >
        <p>
          <strong>Q:</strong> {quiz.question}
        </p>

        <button
          className="mt-3 px-3 py-1 border rounded"
          onClick={() => {
            if (visibleAnswers.includes(index)) {
              setVisibleAnswers(
                visibleAnswers.filter(
                  (i) => i !== index
                )
              );
            } else {
              setVisibleAnswers([
                ...visibleAnswers,
                index,
              ]);
            }
          }}
        >
          {visibleAnswers.includes(index)
            ? "Hide Answer"
            : "Show Answer"}
        </button>

        {visibleAnswers.includes(index) && (
          <p className="mt-3 text-green-700">
            <strong>A:</strong> {quiz.answer}
          </p>
        )}
      </div>
    )
  )}
</div>
        </div>
      )}
    </main>
  );
}