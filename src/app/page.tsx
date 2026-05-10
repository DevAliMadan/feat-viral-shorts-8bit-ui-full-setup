"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { videoFormSchema } from "@/lib/validations/video";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  createdAt: string;
  viralShorts: ViralShort[];
}

interface ViralShort {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  status: string;
  videoUrl?: string;
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch videos on mount and after submit
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
        // Refresh videos list
        const videosResponse = await fetch("/api/videos");
        if (videosResponse.ok) {
          const data = await videosResponse.json();
          setVideos(data);
        }
      } else {
        setMessage("Error submitting video.");
      }
    } catch (error: any) {
      setMessage(error.errors?.[0]?.message || "Validation failed.");
    } finally {
      setLoading(false);
    }
  };

  const totalShorts = videos.reduce((acc, video) => acc + video.viralShorts.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8">
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
                <p className="text-sm">VIDEOS: {videos.length}</p>
                <p className="text-sm">SHORTS: {totalShorts}</p>
            </div>
            <div className="nes-container with-title">
                <p className="title text-xs">STATUS</p>
                <p className="text-sm text-green-600">SYSTEM READY</p>
            </div>
        </div>

        {/* Videos and Shorts Display */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">UPLOADED VIDEOS</h2>
          {fetchLoading ? (
            <p className="text-center">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-600">No videos yet. Submit one above!</p>
          ) : (
            <div className="space-y-6">
              {videos.map((video) => (
                <Card key={video.id} className="nes-container">
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>YouTube ID: {video.youtubeId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm"><strong>Description:</strong> {video.description || "N/A"}</p>
                      <p className="text-sm"><strong>Added:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                    {video.viralShorts.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-2">Viral Shorts ({video.viralShorts.length}):</h4>
                        <div className="space-y-2">
                          {video.viralShorts.map((short) => (
                            <div key={short.id} className="bg-gray-50 p-3 rounded border border-gray-300">
                              <p className="font-semibold">{short.title}</p>
                              <p className="text-sm">Time: {short.startTime}s - {short.endTime}s</p>
                              <p className="text-sm">Status: <span className="font-bold">{short.status}</span></p>
                              {short.videoUrl && (
                                <a href={short.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">View Short →</a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
