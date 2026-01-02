const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (sum, nextBlog) => sum + nextBlog.likes,
    0
  )
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (max, next) =>
      (next.likes > max.likes) ? {title: next.title, author: next.author, likes: next.likes} : max,
    {likes: -1}
  )
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce(
    (aggregate, next) => {
      const author = next.author
      if (author in aggregate) {
        return {...aggregate, [author]: aggregate[author] + 1}
      } else {
        return {...aggregate, [author]: 1}
      }
    },
    {}
  )
  const mostPopular = Object.entries(authors).reduce(
    (max, next) => (next[1] > max[1]) ? next : max,
    ['', -1]
  )
  return {'author': mostPopular[0], 'blogs': mostPopular[1]}
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce(
    (aggregate, next) => {
      const author = next.author
      const likes = next.likes
      if (author in aggregate) {
        return {...aggregate, [author]: aggregate[author] + likes}
      } else {
        return {...aggregate, [author]: likes}
      }
    },
    {}
  )
  const mostLikes = Object.entries(authors).reduce(
    (max, next) => (next[1] > max[1]) ? next : max,
    ['', -1]
  )
  return {'author': mostLikes[0], 'likes': mostLikes[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}