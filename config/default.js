module.exports = {
    mongodb: 'mongodb://localhost:27017/blog',
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 2592000000
    },
    page: {
        frontLimit: 6,
        behindLimit: 10
    }
}