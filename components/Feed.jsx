'use client'

import {useState, useEffect} from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({data, handleTagClick}) => (
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
  const [searchText, setSearchText] = useState('')
  const [posts, setPosts] = useState([])
  const handleSearch = (e) => {

  }

  useEffect(() => {
    const fetchPosts = async () => {
      const resp = await fetch("/api/prompt")
      const data = await resp.json()
      setPosts(data)
    } 
    fetchPosts()
  }, [])
  
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
      </form>
      <PromptCardList
        data={posts}
        handleTagClick={() => {}}
      />
    </section>
  )
}

export default Feed