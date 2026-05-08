import { groq, LUNA_SYSTEM_PROMPT, ALIEN_SYSTEM_PROMPT } from "@/lib/groq";

export async function POST(req: Request) {
  const { messages, mode } = await req.json();

  const systemPrompt = mode === "alien" ? ALIEN_SYSTEM_PROMPT : LUNA_SYSTEM_PROMPT;

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content ?? "";
        if (content) {
          const data = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
