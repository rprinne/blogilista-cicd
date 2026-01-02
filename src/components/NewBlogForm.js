import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id='title-input'
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id='author-input'
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id='url-input'
          />
        </div>
        <button type="submit" id="submit-button">submit</button>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default NewBlogForm