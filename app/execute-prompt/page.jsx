'use client'

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"


const ExecutePrompt = () => {
    const searchParams = useSearchParams()
    const prompt = searchParams.get('prompt')
    const tag = searchParams.get('tag')
    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState({
        prompt: prompt,
        tag: tag,
        systemPrompt: "",
        result: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        await getPromptDetails()
        setLoading(false)
    }

    const getPromptDetails = async () => {
        const resp = await axios.post(`/api/prompt/execute`,
        {
                timeout: 60000,
                prompt: prompt,
                systemPrompt: post.systemPrompt != "" ? post.systemPrompt : "You are a helpful assistant."
            })
        setPost({
            ...post,
            result: resp.data.result
        })
    }

    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="blue_gradient">Execute Prompt</span>
            </h1>
            <p className="desc text-left">{post.prompt}</p>
            <p className="font-inter text-sm blue_gradient">#{post.tag}</p>
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
                        value={post.systemPrompt}
                        onChange={(e) => setPost({ ...post, systemPrompt: e.target.value })}
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
                    post.result ? (
                        <div className="w-full glassmorphism">
                            <pre className="pre">
                                {post.result}
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