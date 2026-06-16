"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyzeVideo = async () => {
    try {
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
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8">
        YouTube Learning Assistant
      </h1>

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
      >
        Analyze Video
      </button>

      {result && (
        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <p>{result.data.summary}</p>
        </div>
      )}
    </main>
  );
}