const listHelper = require('../utils/list_helper');
const testHelper = require('./test_helper');

describe('dummy', () => {
  test('dummy return one', () => {
    const result =listHelper.dummy(testHelper.initialBlogs);
    expect(result).toBe(1);
  });
});

describe('total likes', () => {
  test('totalLikes returns 36', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs);
    expect(result).toBe(36);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe('favoriteBlog', () => {
  test('favorite blog is Canonical', () => {
    const result = listHelper.favoriteBlog(testHelper.initialBlogs);
    expect(result).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    );
  });

  test('favorite of one blog is the the blog itself', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog);
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    );
  });
});

describe('mostBlogs return correct author', () => {
  test('Martin has most blogs', () => {
    const result = listHelper.mostBlogs(testHelper.initialBlogs);
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    );
  });
});

describe('mostLikes returns correct author and number of likes', () => {
  test('Dijkstra has most likes (17)', () => {
    const result = listHelper.mostLikes(testHelper.initialBlogs);
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    );
  });
});