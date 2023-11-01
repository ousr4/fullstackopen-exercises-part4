const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have an id attribute', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(r => expect(r.id).toBeDefined())
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'How to use std::span from C++20',
        author: 'Bartłomiej Filipek',
        url: 'https://www.cppstories.com/2023/four-views-in-cpp23/',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('How to use std::span from C++20')
})

test('likes property defaulted to 0 if missing', async () => {
    const newBlog = {
        title: 'How to use std::span from C++20',
        author: 'Bartłomiej Filipek',
        url: 'https://www.cppstories.com/2023/four-views-in-cpp23/',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    let lastBlog = response.body[initialBlogs.length]
    expect(lastBlog.likes).toBe(0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'Bartłomiej Filipek',
        url: 'https://www.cppstories.com/2023/four-views-in-cpp23/',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog withou url is not added', async () => {
    const newBlog = {
        title: 'How to use std::span from C++20',
        author: 'Bartłomiej Filipek',
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})
afterAll(async () => {
    mongoose.connection.close()
})
