const {test, after, describe} = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const api = supertest(app);

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

beforeEach(async () => {  
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash("testime nüüd", 10)
      const user = new User({
         username: "kas sa ",
         name: "nüüd saad",
         blogs: [],
         passwordHash
      })
    
      await user.save()
  }, 100000)
  
  eforeEach(async () => {  
    await Blog.deleteMany({})
  
    const users = await User.find({})
    const user = users[0]
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: user._id,
        likes: blog.likes ? blog.likes : 0
      }))
  
    const promiseArray = blogObjects.map(blog => {
        blog.save()
        user.blogs = user.blogs.concat(blog._id)
      })
    await Promise.all(promiseArray)
    await user.save()
  }, 100000)


test('a specific blog can be viewed via ID', async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(resultBlog).toBeDefined();
});

test('succeeds with valid data', async () => {
    const newBlog = {
        title: 'hanna',
        author: '1337',
        url: 'www.neti.ee',
        likes: 43434
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('hanna');
});


test("blog deletion", async () => {
    const newBlog = {
        title: 'hanna',
        author: '1337',
        url: 'www.neti.ee',
        likes: 43434
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart.find(blog => blog.title === 'hanna');

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).not.toContain('hanna');
});

test('a blog cannot be added by unauthorized users', async () => {
    const newBlog = {
      title: 'safsd dfsdfdsfds',
      author: 'Martin Risto Andreas',
      url: 'www.neti.ee',
      likes: 4343
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(n => n.title)

    expect(titles).not.toContain(
      'safsd dfsdfdsfds'
    )
  }, 100000)

  test('vähemalt 3 tähte nimes', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'se',
        name: 'hanna',
        password: 'parool',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })


  
  test('vähemalt 3 tähte paroolis', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'test1',
        name: 'test2',
        password: 'ko'
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('only correct user', async () => {
    const newBlog = {
      title: 'hanna',
      author: 'teeb nüüd',
      url: 'www.neti.ee',
      likes: 207
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(n => n.title)

    expect(titles).not.toContain(
      'hanna'
    )
  }, 100000)

test("updating blog post", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[4];
    const updateBlog = {
        title: 'hanna',
        author: '1337',
        url: 'www.neti.ee',
        likes: 1337
    };

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const blogsAfterEnd = await helper.blogsInDB();
    const updatedBlogInDB = blogsAfterEnd.find(blog => blog.id === blogToUpdate.id);
    expect(updatedBlogInDB).toEqual(expect.objectContaining(updateBlog));
});

    after(async () => {
        await mongoose.connection.close();
    });