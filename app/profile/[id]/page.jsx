'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import Profile from "@components/Profile"

const UserProfile = ({params}) => {
    const [posts, setPosts] = useState([])
    const searchParams = useSearchParams()
    const name = searchParams.get('name')

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const fetchPosts = async () => {
            const resp = await fetch(`/api/users/${params.id}/posts`, { signal })
            const data = await resp.json()
            setPosts(data)
        }

        if (params.id) fetchPosts()

        return () => {
            controller.abort()
        }
    }, [params.id])

    return (
        <Profile
            name={name}
            desc={`Welcome to ${name}'s personalized profile page. Explore ${name}'s exceptional prompts and be inspired by the power of their imagination`}
            data={posts}
        />
    )
}

export default UserProfile