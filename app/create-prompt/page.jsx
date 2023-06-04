'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import Form from "@components/Form"

const CreatePropmt = () => {
  const router = useRouter()
  const {data: session} = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [post, setPost] = useState({
    prompt: "",
    tag: ""
  })

  let createPrompt = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const resp = await fetch('/api/prompt/new', {
        method: "POST",
        body: JSON.stringify({
          prompt:post.prompt,
          userId: session?.user.id,
          tag: post.tag
        })
      })

      if (resp.ok) {
        router.push("/")
      }
    } catch(e) {
      console.log(e);
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  )
}

export default CreatePropmt