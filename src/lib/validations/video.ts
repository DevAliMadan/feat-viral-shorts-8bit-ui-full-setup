import { z } from "zod";

export const youtubeUrlSchema = z.string().url().refine((url) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
}, "Invalid YouTube URL");

export const videoFormSchema = z.object({
  url: youtubeUrlSchema,
  title: z.string().min(1, "Title is required").max(100),
});

export const viralMomentSchema = z.object({
  videoId: z.string(),
  title: z.string().min(1).max(50),
  startTime: z.number().min(0),
  endTime: z.number().min(1),
});
