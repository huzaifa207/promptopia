'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

import Profile from "@components/Profile"

const MyProfile = () => {
    const { data: session } = useSession({
        required: true,
    })
    console.log(session, 'test');
    const [posts, setPosts] = useState([])
    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE"
                })

                const filteredPosts = posts.filter((p) => p._id !== post._id)
                setPosts(filteredPosts)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }

    useEffect(() => {
        // const controller = new AbortController()
        // const signal = controller.signal
        const fetchPosts = async () => {
            console.log(session?.user.id);
            const resp = await fetch(`/api/users/${session?.user.id}/posts`)
            const data = await resp.json()
            console.log(data);
            setPosts(data)
        }
        console.log(session?.user.id, "test1");

        if (session?.user.id) fetchPosts()

        // return () => {
        //     controller.abort()
        // }
    }, [])

    return (
        <Profile
            name="My"
            desc="Welcome to your personalized profile page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile