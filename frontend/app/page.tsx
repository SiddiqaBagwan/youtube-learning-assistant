"use client";

import { useState } from "react";
import axios from "axios";
import {
  Brain,
  BookOpen,
  FileText,
  CircleHelp,
} from "lucide-react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<number[]>([]);

  const analyzeVideo = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://vidmentor.onrender.com/analyze",
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

  const downloadNotes = () => {
  if (!result) return;

  const content = `
SUMMARY

${result.data.summary}

---------------------------------

STUDY NOTES

${result.data.study_notes.join("\n")}

---------------------------------

KEY CONCEPTS

${result.data.key_concepts.join("\n")}

---------------------------------

IMPORTANT TERMS

${result.data.important_terms.join("\n")}

---------------------------------

QUIZ QUESTIONS

${result.data.quiz_questions
  .map(
    (q: any, i: number) =>
      `${i + 1}. ${q.question}\nAnswer: ${q.answer}`
  )
  .join("\n\n")}
`;

  const blob = new Blob([content], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "study-material.txt";
  a.click();

  URL.revokeObjectURL(url);
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-blue-100 flex flex-col items-center p-10">
      <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
  VidMentor
</h1>

<p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
  Your AI-powered study companion for YouTube videos.
  
</p>

      <input
        type="text"
        placeholder="Paste YouTube URL..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="bg-white/80 backdrop-blur-md p-4 rounded-2xl w-full max-w-3xl shadow-2xl border border-white"
      />

      <div className="flex gap-3 mt-4 flex-wrap">
  <button
    className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition shadow-lg"
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

  <button
    className="px-6 py-3 border rounded-lg bg-white"
    onClick={downloadNotes}
    disabled={!result}
  >
    Download Notes
  </button>
</div>
      {result && result.success && (
        <div className="mt-10 w-full max-w-5xl space-y-6">

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
  <Brain size={24} />
  Summary
</h2>
            <p>{result.data.summary}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-2xl font-bold flex items-center gap-2">
  <BookOpen size={24} />
  Study Notes
</h2>

    <button
      className="px-3 py-1 border rounded hover:bg-gray-100"
      onClick={() => {
        navigator.clipboard.writeText(
          result.data.study_notes.join("\n")
        );

        alert("Study notes copied!");
      }}
    >
      Copy Notes
    </button>
  </div>

  <ul className="list-disc pl-5 space-y-2">
    {result.data.study_notes.map(
      (note: string, index: number) => (
        <li key={index}>{note}</li>
      )
    )}
  </ul>
</div>

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
  <FileText size={24} />
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

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white">
            <h2 className="text-2xl font-bold mb-3">
              Important Terms
            </h2>

            <div className="flex flex-wrap gap-2">
              {result.data.important_terms.map(
                (term: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm shadow"
                  >
                    {term}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white">
  <h2 className="text-2xl font-bold flex items-center gap-2">
  <CircleHelp size={24} />
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
        className="bg-slate-50 rounded-2xl p-5 mb-4 shadow"
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