module.exports = {
    mongodb: 'mongodb://localhost:27017/blog',
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 12*60*60*1000
    },
    page: {
        frontLimit: 12,
        behindLimit: 10
    }
}