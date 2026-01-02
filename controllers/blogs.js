const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (req, res, next) => {
  Blog
    .find({}).populate('user', {username: 1, name: 1})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (req, res, next) => {
  const body = req.body

  if (body.user === undefined) {
    return res.status(401).json({ error: 'token invalid' })
  }
  Blog
    .findById(req.params.id)
    .then(foundBlog => {
      if (!foundBlog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      if (foundBlog.user.toString() !== body.user) {
        return res.status(401).json({ error: 'unauthorized' })
      }
      return Blog.findByIdAndRemove(foundBlog._id)
    })
    .then( () => {
      res.status(204).json({ message: 'Blog removed successfully' })
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const updatedBlog =
    await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
  res.status(200).json(updatedBlog)
})

blogsRouter.put('/:id/comments', async (req, res) => {
  const comment = req.body.comment
  const updatedBlog =
    await Blog.findByIdAndUpdate(req.params.id,
      { '$push': { 'comments': comment } },
      { new: true })
  res.status(200).json(updatedBlog)
})

blogsRouter.post('/', (req, res, next) => {
  const body = req.body
  if (body.user === undefined) {
    return res.status(401).json({ error: 'invalid token' })
  } else if (body.title === undefined || body.author === undefined) {
    return res.status(400).json({error: 'some content missing'})
  }

  User
    .findById(body.user)
    .then(foundUser => {
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: foundUser._id,
        comments: body.comments || [],
      })
      return Promise.all([foundUser, blog.save()])
    })
    .then(([foundUser, savedBlog]) => {
      foundUser.blogs.push(savedBlog._id)
      return Promise.all([foundUser.save(), savedBlog])
    })
    .then(([, savedBlog]) => {
      res.status(201).json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter