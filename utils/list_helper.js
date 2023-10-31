const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let maxLikes = 0
    let favoriteBlog = null
    blogs.forEach(blog => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favoriteBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })
    return favoriteBlog
}
const mostBlogs = (blogs) => {
    const nbBlogs = _.countBy(blogs, 'author')
    let maxBlogs = 0
    let mostBlogs = null
    for (const [author, blogs] of Object.entries(nbBlogs)) {
        if (blogs > maxBlogs) {
            maxBlogs = blogs
            mostBlogs = {
                author,
                blogs
            }
        }
    }
    return mostBlogs
}

const mostLikes = (likes) => {
    const nbLikes = _.reduce(likes, (result, elem) => {
        if(result[elem.author] === undefined) {
            result[elem.author] = elem.likes
        } else {
            result[elem.author] += elem.likes
        }
        return result
    }, {})
    let maxLikes = 0
    let mostLikes = null
    for (const [author, likes] of Object.entries(nbLikes)) {
        if (likes > maxLikes) {
            maxLikes = likes
            mostLikes = {
                author,
                likes
            }
        }
    }
    return mostLikes
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
