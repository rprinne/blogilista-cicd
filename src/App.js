import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Toggleable from './components/Toggleable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [which, setWhich] = useState(null)

  const [user, setUser] = useState(null)

  useEffect(() => {
    updateBlogsFromDB()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //const blogFormRef = useRef()

  const updateBlogsFromDB = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
    )
  }

  const handleNotification = (message, which) => {
    setWhich(which)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
    } catch (exeption) {
      handleNotification('wrong credentials', 'error')
    }
  }

  const addBlog = async (newBlog) =>
    blogService
      .create(newBlog)
      .then(() => {
        updateBlogsFromDB()
        handleNotification('New blog added', 'success')
      })
      .catch(error => {
        handleNotification(error.message, 'error')
      })

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <div>
      <Notification message={notificationMessage} which={which}/>

      {!user &&
        <LoginForm
          handleLogin={handleLogin}
        />
      }

      {user &&
        <p>{user.name} logged in <button id={'logout-button'} onClick={logout}>logout</button></p>
      }

      {user &&
        <Toggleable buttonLabel="Add new">
          <NewBlogForm
            createBlog={addBlog}
          />
        </Toggleable>
      }

      {user && <div>
        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            user={user.username}
            blog={blog}
            handleLike={() => {
              const updatedBlog = { ...blog,
                user: blog.user.id,
                likes: blog.likes + 1 }
              blogService.update(blog.id.toString(), updatedBlog).then(updateBlogsFromDB())
            }}
            handleRemove={() => {
              if (window.confirm(`Remove blog ${blog.name} by ${blog.author}?`)){
                blogService.remove(blog.id)
                  .then( response => {
                    if (response.status === 204) {
                      updateBlogsFromDB()
                      handleNotification('blog removed successfully', 'success')
                    } else {
                      handleNotification(response, 'error')
                    }
                  })
              }
            }}
          />
        )}
      </div>}
    </div>
  )
}

export default App