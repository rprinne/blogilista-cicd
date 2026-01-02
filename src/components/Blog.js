import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  if (expanded) {
    return (
      <div className={'blog'} id={blog.title} style={blogStyle}>
        <p><span>{blog.title}</span> <em>by <span>{blog.author}</span></em> <button onClick={toggleExpanded}>hide</button><br/>
          <span>{blog.url}</span><br/>
          <span>likes: {blog.likes}</span> <button name={'like-button'} onClick={handleLike}>like</button><br/>
          <span>{blog.user.name}</span><br/>
          { user === blog.user.username ? <button onClick={handleRemove}>remove</button> : null }
        </p>
      </div>
    )
  } else {
    return (
      <ul className={'blog'} id={blog.title} style={blogStyle}>
        {blog.title} <em>by {blog.author}</em> <button onClick={toggleExpanded}>view</button>
      </ul>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog