import { createParser } from "eventsource-parser";

export const openAIStream = async (payload) => {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let counter = 0;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CHATGPT_KEY}`,
        },
        method: "POST",
        body: JSON.stringify(payload)
    })

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event) {
                if (event.type === 'event') {
                    const data = event.data

                    if (data === '[DONE]') {
                        controller.close()
                        return
                    }
                    try {
                        const json = JSON.parse(data)
                        const text = json.choices[0].delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            // this is a prefix character (i.e., "\n\n"), do nothing
                            return
                        }

                        const queue = encoder.encode(text)
                        controller.enqueue(queue)
                        counter++

                    } catch (error) {
                        controller.error(error)
                    }
                }
            }

            const parser = createParser(onParse)

            for await (const chunk of res.body) {
                parser.feed(decoder.decode(chunk))
            }
        }
    })

    return stream
}