'use client'

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"


const ExecutePrompt = () => {
    const searchParams = useSearchParams()
    const prompt = searchParams.get('prompt')
    const tag = searchParams.get('tag')
    const [loading, setLoading] = useState(false)
    const [systemPrompt, setSystemPrompt] = useState("")
    const [response, setResponse] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setLoading(true)
        setResponse("")
        const resp = await fetch(`/api/prompt/execute`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    systemPrompt: systemPrompt != "" ? systemPrompt : "You are a helpful assistant."
                })
            })

        if (!resp.ok) {
            throw new Error(resp.statusText)
        }

        const data = resp.body

        if (!data) {
            return
        }
        const reader = data.getReader()
        const decoder = new TextDecoder()
        let done = false

        while (!done) {
            const {value, done: doneReading} = await reader.read()
            done = doneReading
            const chunkValue = decoder.decode(value)

            setResponse(prev => prev + chunkValue)
            
        }
        setLoading(false)
    }

    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="blue_gradient">Execute Prompt</span>
            </h1>
            <p className="desc text-left">{prompt}</p>
            <p className="font-inter text-sm blue_gradient">#{tag}</p>
            <form
                onSubmit={handleSubmit}
                className="my-5"
            >
                <label>
                    <span className="font-satoshi font-semibold text-base text-gray-700">
                        Message {` `}
                        <span className="font-normal">(Explain like a professional software engineer, Explain like a 10 year old, Explain like a pirate)</span>
                    </span>
                    <input
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Enter a system message for ChatGPT"
                        className="form_input"
                    />
                </label>
                <div className="flex-end mx-3 mb-5 mt-3 gap-4">
                    <button
                        type="Submit"
                        className="px-5 py-1.5 text-sm bg-blue-700 rounded-full text-white"
                    >
                        Execute
                    </button>
                </div>
            </form>
            <div>

                {loading ? (
                    <div className="w-full flex items-center justify-center">
                        <Image
                            src="/assets/icons/loader2.svg"
                            alt="Loading image"
                            height={300}
                            width={300}
                        />
                    </div>
                ) : (
                    response ? (
                        <div className="w-full glassmorphism">
                            <pre className="pre">
                                {response}
                            </pre>
                        </div>
                    ) : (
                        <></>
                    )
                )}
            </div>
        </section>
    )
}

export default ExecutePrompt