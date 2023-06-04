'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Form from "@components/Form"

const EditPrompt = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptId = searchParams.get('id')
  const [submitting, setSubmitting] = useState(false)
  const [post, setPost] = useState({
    prompt: "",
    tag: ""
  })

  useEffect(() => {
    const getPromptDetails = async () => {
        const resp = await fetch(`/api/prompt/${promptId}`)
        const data = await resp.json()
        setPost({
            prompt: data.prompt,
            tag: data.tag
        })
    }
    
    if (promptId) getPromptDetails()
    
  }, [promptId])
  

  let updatePrompt = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    if (!promptId) return alert("Prompt ID not found")
    else{

    }
    try {
      const resp = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt:post.prompt,
          tag: post.tag
        })
      })

      if (resp.ok) {
        router.push("/profile")
      }
    } catch(e) {
      console.log(e);
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  )
}

export default EditPrompt