describe('Blog app', function() {
  const user = {
    name: 'testUser',
    username: 'testUsername',
    password: 'testPassword'
  }
  const user2 = {
    name: 'testUser2',
    username: 'testUsername2',
    password: 'testPassword2'
  }
  const blog = {
    title: 'testBlog',
    author: 'testAuthor',
    url: 'testUrl'
  }
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  describe('Login', function() {
    it('user can login', function () {
      cy.contains('Login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()

      cy.contains(`${user.name} logged in`)
    })

    it('Login fails with wrong password', function() {
      cy.contains('Login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('Login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
    })

    it('A blog can be created, liked and removed', function() {
      cy.contains('Add new').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#submit-button').click()

      cy.contains(blog.title)
      cy.contains(blog.author)
      cy.contains('view').click()
      cy.contains('likes: 0')
      cy.contains('button', 'like').click()
      cy.contains('likes: 1')
      cy.contains('remove').click()
      cy.contains(blog.title).should('not.exist')
    })

    it('Remove visible only for the user who created the blog', function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
      cy.contains('Add new').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#submit-button').click()
      cy.contains('logout').click()

      cy.contains('Login').click()
      cy.get('#username').type(user2.username)
      cy.get('#password').type(user2.password)
      cy.get('#login-button').click()
      cy.contains(blog.title)
      cy.contains(blog.author)
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('Blogs are sorted according to likes', function() {
      let blogs = []
      let likes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      likes.sort(() => (Math.random() > .5 ? 1 : -1))
      for (const i of [1,2,3,4,5,6,7,8,9,10]) {
        const blog = {
          title: `title${i}`,
          author: `author${i}`,
          url: `url${i}`,
          likes: likes[i]
        }
        blogs.push(blog)
      }
      cy.contains('Add new').click()
      for (const blog of blogs) {
        cy.get('#title-input').type(blog.title)
        cy.get('#author-input').type(blog.author)
        cy.get('#url-input').type(blog.url)
        cy.get('#submit-button').click()
        cy.contains('view').last().click()
        for (let i = 0; i < blog.likes; i++ ) {
          cy.get(`#${blog.title}`).within(() => {
            cy.get('*[name^="like-button"]').click()
            cy.wait(250)
          })
        }
      }
      blogs.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
      console.log(blogs)
      for (let i = 0; i < 10; i++) {
        cy.get('.blog').eq(i).should('contain', blogs[i].title)
      }
    })
  })
})