import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const BodySchema = z.object({
  topic: z.string().min(3),
  product: z.string().min(2),
  audience: z.string().default("Developers"),
  num_questions: z.number().int().min(3).max(20).default(10),
  tone: z.string().default("clear and helpful"),
  language: z.string().default("en")
});

const OUTPUT_SCHEMA = `
Return ONLY minified JSON matching this TypeScript type:
type Output = {
  faqs: { question: string; answer: string; }[];
  jsonld: string; // a valid JSON-LD object string for schema.org FAQPage
  title: string; // SEO title for the FAQ page (<= 60 chars if possible)
  meta_description: string; // 140-160 chars
  notes: string[]; // short bullet notes about important constraints you applied
};
`;

const SYSTEM_PROMPT = `
You are an SEO assistant for developer-tool companies.
Goal: Generate high-quality FAQ content that can win "People Also Ask" and rich results.

Hard rules:
- Answers must be factual, non-harmful, and avoid medical/legal/financial claims.
- Tone should match the audience and be technically accurate.
- Each answer 60–160 words, skimmable, with 0–1 code snippets if truly needed.
- Do NOT invent product capabilities.
- Include JSON-LD (schema.org FAQPage) with the same Q&A.
- Output must be STRICTLY the requested JSON (no markdown, no prose, no comments).

${OUTPUT_SCHEMA}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, product, audience, num_questions, tone, language } =
      BodySchema.parse(body);

    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY! });

    const userPrompt = [
      `Topic: ${topic}`,
      `Product: ${product}`,
      `Audience: ${audience}`,
      `Questions: ${num_questions}`,
      `Tone: ${tone}`,
      `Language: ${language}`,
      ``,
      `Instructions:`,
      `1) Create ${num_questions} PAA-style FAQs specific to the topic and audience.`,
      `2) Prioritize intent diversity: how/why/what/when/compare/troubleshoot/security/cost/perf.`,
      `3) Avoid brand hype. If uncertain, hedge with "typically", "in many setups".`,
      `4) Generate JSON-LD (FAQPage) with the SAME Q&A.`,
      `5) Return ONLY minified JSON that matches the Output type.`
    ].join("\n");

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2000,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }]
    });

    // Claude returns content as a list of blocks; we expect a single JSON string block.
    const text = msg.content?.[0]?.type === "text" ? msg.content[0].text : "";
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from model" },
        { status: 502 }
      );
    }

    // Validate model output is valid JSON & shape
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Model output was not valid JSON", raw: text },
        { status: 502 }
      );
    }

    // Optional: light validation of the returned JSON
    const OutputSchema = z.object({
      faqs: z.array(
        z.object({
          question: z.string().min(5),
          answer: z.string().min(40)
        })
      ),
      jsonld: z.string().min(10),
      title: z.string().min(3).max(90),
      meta_description: z.string().min(30).max(200),
      notes: z.array(z.string()).default([])
    });

    const safe = OutputSchema.parse(parsed);

    return NextResponse.json(safe, { status: 200 });
  } catch (err: unknown) {
    console.error("FAQ Builder API Error:", err);
    // Basic error surfacing
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 400 }
    );
  }
}