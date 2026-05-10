import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { videoFormSchema } from "@/lib/validations/video";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = videoFormSchema.parse(body);

    // Simple regex to extract YouTube ID
    const youtubeIdMatch = validatedData.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : "unknown";

    const video = await prisma.video.create({
      data: {
        youtubeId,
        title: validatedData.title,
        description: "Transformed via Viral Shorts 8-bit UI",
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        viralShorts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
