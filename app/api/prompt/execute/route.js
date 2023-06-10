import { openAIStream } from "@utils/gpt";

export const runtime = 'edge'

export const POST = async (req) => {
    const { prompt, systemPrompt } = await req.json()
    
    const messages = [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: prompt
        }]

    const payload = {
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: true,
      };

    try {

        const stream = await openAIStream(payload)

        return new Response(stream)
    } catch (e) {
        console.log(e);
        return new Response("Failed to fetch all prompts!", { status: 500 })
    }
}