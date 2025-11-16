// app/api/coach/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as { role: "user" | "assistant"; content: string }[];

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 🔑 Make sure OPENAI_API_KEY is set in your .env.local
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server" },
        { status: 500 }
      );
    }

    // Simple system prompt to keep the coach on-brand
    const systemMessage = {
      role: "system",
      content:
        "You are MicroTrade Coach, a friendly trading mentor. " +
        "Explain concepts clearly, avoid giving direct financial advice, and focus on education, micro trading, risk management, and order types. " +
        "User is using a demo micro-trading app; keep tone helpful and encouraging.",
    };

    const payload = {
      model: "gpt-4.1-mini",
      messages: [systemMessage, ...messages],
      max_tokens: 400,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "AI request failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "I’m not sure how to answer that yet.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Coach API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
