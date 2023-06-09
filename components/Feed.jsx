'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => (
  <div className='mt-16 prompt_layout'>
    {data.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
      />
    ))}
  </div>
)

const Feed = () => {
  const [posts, setPosts] = useState([])

  const [searchText, setSearchText] = useState('')
  const [searchedPosts, setSearchedPosts] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null)

  const handleSearch = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const filteredPosts = filterPosts(e.target.value)
        setSearchedPosts(filteredPosts)
      }, 500)
    )
  }

  const filterPosts = (text) => {
    const regex = new RegExp(text, "i")
    let filteredPosts = posts.filter((post) => (
      regex.test(post.prompt) ||
      regex.test(post.tag) ||
      regex.test(post.creator.username)
    ))
    return filteredPosts
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const resp = await fetch("/api/prompt")
      const data = await resp.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  const handleTagClick = (tag) => {
    setSearchText(tag)

    const filteredPrompts = filterPosts(tag)
    setSearchedPosts(filteredPrompts)
  }

  const handleSearchBar = () => {
    setSearchText("")
  }

  return (
    <section className='feed'>
      <form action="" className='relative w-full flex-center'>
        <input
          type="text"
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={handleSearch}
          required
          className='search_input peer'
        />
        {searchText &&
          <div className='close_btn' onClick={handleSearchBar}>
            <Image
              src="/assets/icons/cross.svg"
              width={25}
              height={25}
            />
          </div>
        }
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedPosts}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
        />)
      }
    </section>
  )
}

export default Feed