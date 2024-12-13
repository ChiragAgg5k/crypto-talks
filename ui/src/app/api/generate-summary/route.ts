import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { article } = await request.json();

    // Validate input
    if (!article) {
      return NextResponse.json(
        { error: "Article text is required" },
        { status: 400 },
      );
    }

    // Generate summary using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Create a precise, structured summary with the following guidelines:
- Extract the core message in one sentence
- Identify 2-3 critical insights or key developments
- Use clear, concise language
- Avoid unnecessary context or background information
- Focus on factual, actionable information
- Maintain a neutral, objective tone
- Do NOT start the summary with any introductory phrase like "Here is a summary" or "This article discusses"`,
        },
        {
          role: "user",
          content: `Summarize the following crypto news article with maximum precision. Highlight the most significant information:

${article}`,
        },
      ],
      model: "llama3-8b-8192",
      max_tokens: 150,
      temperature: 0.3,
    });

    // Extract the summary from the response
    const summary =
      completion.choices[0]?.message?.content || "Unable to generate summary.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}

// Ensure this endpoint can handle POST requests
export const runtime = "edge";
