const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const testHelper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const testUser = {
      username: 'testUsername',
      name: 'testUser',
      password: 'password'
    }

    await api.post('/api/users').send(testUser)

    const login = await api
      .post('/api/login')
      .send({username: testUser.username, password: testUser.password})

    token = login.body.token

    for (const blog of testHelper.initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(blog)
    }
  })

  describe('GET', () => {
    test('Blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('All blogs are returned', async () => {
      const res = await api.get('/api/blogs')
      expect(res.body).toHaveLength(testHelper.initialBlogs.length)
    })
    test('Every blog has an id', async () => {
      const res = await api.get('/api/blogs')
      for (const blog of res.body) {
        expect(blog.id).toBeDefined()
      }
    })
  })

  describe('POST', () => {
    test('New blog is added', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(testHelper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)
      expect(blogsAtEnd.map(blog => blog.title)).toContain('NewBlog')
    })
    test('Every blog has an id', async () => {
      const res = await api.get('/api/blogs')
      for (const blog of res.body) {
        expect(blog.id).toBeDefined()
      }
    })
    test('If likes is not specified, set it to zero', async () => {
      const res = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(testHelper.newBlog)
      expect(res.body).toHaveProperty('likes', 0)
    })
    test('If title is missing, return 400 Bad Request', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(testHelper.noTitleBlog)
        .expect(400)
    })
    test('If author is missing, return 400 Bad Request', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(testHelper.noAuthorBlog)
        .expect(400)
    })
    test('If token is missing, return 401 Unauthorized', async () => {
      await api
        .post('/api/blogs')
        .send(testHelper.newBlog)
        .expect(401)
    })
  })

  describe('DELETE', () => {
    test('The blog is deleted', async () => {
      const blogsAtFirst = await testHelper.blogsInDb()
      const blogToDelete = blogsAtFirst[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtFirst.length-1)

      const contents = blogsAtEnd.map(r => r.id)

      expect(contents).not.toContain(blogToDelete.id)
    })
  })

  describe('PUT', () => {
    test('The blog is updated', async () => {
      const blogsAtFirst = await testHelper.blogsInDb()
      const blogToUpdate = blogsAtFirst[0]

      const newLikes = { likes: 16 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newLikes)
        .expect(200)

      const blogsAtEnd = await testHelper.blogsInDb()

      for (const blog of blogsAtEnd.filter(b => b.id === blogToUpdate.id)) {
        expect(blog.likes).toEqual(newLikes.likes)
      }
    })
  })
})

describe('Users', () => {
  describe('POST', () => {
    test('User is not created if username is missing', async () => {
      const newUser = {name: 'testname', password: 'password'}
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
    test('User is not created if password is missing', async () => {
      const newUser = {name: 'testname', username: 'testusername'}
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
    test('User is not created if username is too short', async () => {
      const newUser = {name: 'testname', username: 'aa', password: 'password'}
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
    test('User is not created if password is too short', async () => {
      const newUser = {name: 'testname', username: 'username', password: 'aa'}
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
  })
})