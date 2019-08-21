const router = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { isLoggedIn, isSameUser } = require('../middleware/auth')
const { validate } = require('../middleware/users')

const excludeKeys = '-__v -password'

router.get('/', isLoggedIn, async (req, res, next) => {
  const status = 200
  const response = await User.find(req.query).select(excludeKeys)
  res.json({ status, response })
})

router.get('/:userId', isLoggedIn, async (req, res, next) => {
  const status = 200
  const response = await User.findById(req.params.userId).select(excludeKeys)
  res.json({ status, response })
})

router.put('/:userId', isLoggedIn, isSameUser, validate, async (req, res, next) => {
  const status = 200
  const query = { _id: req.params.userId }
  const options = { new: true }
  const response = await User.findOneAndUpdate(query, req.body, options).select(excludeKeys)

  res.json({ status, response })
})

router.delete('/:userId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId }
  const response = await User.findOneAndDelete(query, req.body).select(excludeKeys)

  res.json({ status, response })
})

router.delete('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId}
  const user = await User.findOne(query, req.body).select(excludeKeys)
  const post = user.posts.id(req.params.postId)
  post.remove()
  await user.save()

  res.json({ status, response: post })
})

router.put('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId}
  const user = await User.findOne(query, req.body).select(excludeKeys)
  const post = user.posts.id(req.params.postId)
  post.set(req.body)
  await user.save()

  res.json({ status, response: post })
})

router.post('/:userId/posts/new', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 201
  if (req.body.content == '') {
    const message = "Your post must contain content. Please fill out your post and try again."
    const error = new Error(message)
    error.status = 400
    return next(error)
  }
  const query = { _id: req.params.userId}
  const user = await User.findOne(query)
  const post = {...req.body}
  
  user.posts.push(post)
  await user.save()
  const newPost = user.posts[user.posts.length - 1]
  res.json({ status, response: newPost })
})

module.exports = router
