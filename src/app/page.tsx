"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { videoFormSchema } from "@/lib/validations/video";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const validatedData = videoFormSchema.parse({ url, title });

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        setMessage("Video submitted successfully!");
        setUrl("");
        setTitle("");
      } else {
        setMessage("Error submitting video.");
      }
    } catch (error: any) {
      setMessage(error.errors?.[0]?.message || "Validation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="nes-container with-title is-centered">
          <p className="title text-2xl font-bold mb-4">VIRAL SHORTS GENERATOR</p>
          <p className="text-sm mb-6">Turn your long-form YouTube videos into viral pixel-perfect Shorts!</p>
        </div>

        <Card className="nes-container">
          <CardHeader>
            <CardTitle>Submit New Video</CardTitle>
            <CardDescription>Enter the YouTube URL of the video you want to analyze.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="nes-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">YouTube URL</Label>
                <Input
                  id="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="nes-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="nes-btn w-full bg-yellow-400 hover:bg-yellow-500 text-black border-black border-4"
              >
                {loading ? "PROCESSING..." : "ANALYZE MOMENTS"}
              </Button>
            </form>
            {message && <p className="mt-4 text-center text-sm font-bold">{message}</p>}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="nes-container with-title">
                <p className="title text-xs">STATS</p>
                <p className="text-sm">VIDEOS: 0</p>
                <p className="text-sm">SHORTS: 0</p>
            </div>
            <div className="nes-container with-title">
                <p className="title text-xs">STATUS</p>
                <p className="text-sm text-green-600">SYSTEM READY</p>
            </div>
        </div>
      </div>
    </div>
  );
}
