import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export type PostType = {
  id: string
  title: string
  body: string
}

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${data}`)
      
      if (response.status === 404) {
        throw notFound()
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const post: PostType = await response.json()
      return post
    } catch (err) {
      console.error(err)
      throw err
    }
  })

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...')
    await new Promise((r) => setTimeout(r, 1000))
    
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const posts: Array<PostType> = await response.json()
    return posts.slice(0, 10)
  },
)