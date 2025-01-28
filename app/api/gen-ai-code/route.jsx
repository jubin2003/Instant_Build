import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = await result.response.text(); // Await the text response
    return NextResponse.json(JSON.parse(resp)); // Parse and return the JSON response
  } catch (e) {
    // Use `e.message` or a custom error message for debugging
    return NextResponse.json({ error: e.message || "An error occurred while processing the request." });
  }
}
