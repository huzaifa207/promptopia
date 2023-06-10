import axios from "axios"

export const POST = async (req) => {
    const {prompt, systemPrompt} = await req.json()

    const openai = axios.create({
        baseURL: "https://api.openai.com/v1",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CHATGPT_KEY}`,
        },
      });

    try {
        const messages = [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: prompt
            }]
        const resp = await openai.post("/chat/completions", {
            model: "gpt-3.5-turbo",
            messages,
        })
        const result = resp.data.choices[0].message.content

        const responseData = {
            result: result
        }

        return new Response(JSON.stringify(responseData), { status: 200 })
    } catch (e) {
        console.log(e);
        return new Response("Failed to fetch all prompts!", { status: 500 })
    }
}