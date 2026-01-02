import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'test url',
    likes: 1,
    user: { name: 'test user' }
  }
  const likeHandler = jest.fn()
  beforeEach(() => {
    render(<Blog
      blog={blog}
      handleClick={() => {}}
      handleLike={likeHandler}
      handleRemove={() => {}}
    />)
  })
  test('render title and author but not url or likes', () => {
    const title = screen.getByText(blog.title)
    const author = screen.getByText(`by ${blog.author}`)
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText('likes')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('render url and likes after view is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const title = screen.getByText(blog.title)
    const author = screen.getByText(blog.author)
    const url = screen.getByText(blog.url)
    const likes = screen.getByText(`likes: ${blog.likes}`)
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('clicking like twice will call the callback twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByRole('button', { name: /like/i })
    await user.click(likeButton)
    await user.click(likeButton)
    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})