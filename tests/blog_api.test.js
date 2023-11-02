const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initialy some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('content-type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs have an id attribute', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(r => expect(r.id).toBeDefined())
    })
})

describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToView = blogAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('content-type', /application\/json/)

        expect(resultBlog.body).toEqual(blogToView)
    })
    test('failed with error 404 if the blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
        await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })
    test('failed with error 400 if the id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})

describe('addition of new blog', () => {
    test('succeed with valid data', async () => {
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

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain('How to use std::span from C++20')
    })

    test('succeed when likes is missing and likes defaulted to 0', async () => {
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

        const blogsAtEnd = await helper.blogsInDb()
        let lastBlog = blogsAtEnd[helper.initialBlogs.length]
        expect(lastBlog.likes).toBe(0)
    })

    test('failed with error 400 when title is missing', async () => {
        const newBlog = {
            author: 'Bartłomiej Filipek',
            url: 'https://www.cppstories.com/2023/four-views-in-cpp23/',
            likes: 4
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('failed with error 400 when url is missing', async () => {
        const newBlog = {
            title: 'How to use std::span from C++20',
            author: 'Bartłomiej Filipek',
            likes: 4
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('update of an existing blog', () => {
    test('succeed with a valid id', async () => {
        const blogAtStart = await helper.blogsInDb()
        const updatedBlog = {
            ...blogAtStart[0],
            likes: 32,
        }

        const resultBlog = await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('content-type', /application\/json/)


        expect(resultBlog.body).toEqual(updatedBlog)
    })

    test('failed with error 404 is the blog does not exist', async () => {
        const blogAtStart = await helper.blogsInDb()
        const updatedBlog = {
            ...blogAtStart[0],
            likes: 72,
        }

        const validNonExistingId = await helper.nonExistingId()
        await api
            .put(`/api/blogs/${validNonExistingId}`)
            .send(updatedBlog)
            .expect(404)
    })

    test('failed with error 400 if id is invalid', async () => {
        const blogAtStart = await helper.blogsInDb()
        const updatedBlog = {
            ...blogAtStart[0],
            likes: 45,
        }

        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .put(`/api/blogs/${invalidId}`)
            .send(updatedBlog)
            .expect(400)
    })
})
afterAll(async () => {
    mongoose.connection.close()
})
