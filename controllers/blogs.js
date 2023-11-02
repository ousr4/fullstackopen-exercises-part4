const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        author: body.author,
        title: body.title,
        url: body.url,
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
            { new: true, runValidators: true, context: 'query' })
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        }
    } catch(exception) {
        next(exception)
    }
})


module.exports = blogsRouter
