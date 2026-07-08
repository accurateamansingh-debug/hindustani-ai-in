import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const last = body.messages?.[body.messages.length - 1]?.content || "Hello";

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({ reply: "Bhai .env.local me GEMINI_API_KEY nahi hai! Server restart kar." });
    }

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: last }] }] }),
      }
    );

    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ reply: `Gemini Error (${r.status}): ${txt.slice(0, 500)}` });
    }

    const d = await r.json();
    const reply = d.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(d).slice(0, 500);
    return NextResponse.json({ reply });

  } catch (e: any) {
    return NextResponse.json({ reply: `Route.ts Error: ${e.message}` });
  }
}