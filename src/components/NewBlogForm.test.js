import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'test url'
  }
  const mockHandler = jest.fn()
  const { container } = render(<BlogForm createBlog={mockHandler}/>)

  test('NewBlogForm calls the props function with correct parameters', async () => {
    const user = userEvent.setup()
    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    await user.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    console.log(mockHandler.mock.calls[0][0].content)
  })
})