export const POST = async (req) => {
    const {prompt, systemPrompt} = await req.json()

    try {
        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }]
        }

        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CHATGPT_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        })


        const data = await resp.json()
        const result = data.choices[0].message.content

        const responseData = {
            result: result
        }

        return new Response(JSON.stringify(responseData), { status: 200 })
    } catch (e) {
        console.log(e);
        return new Response("Failed to fetch all prompts!", { status: 500 })
    }
}