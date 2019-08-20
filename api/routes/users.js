const router = require('express').Router()
const User = require('../models/user')
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

router.post('/users/:userId/posts', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 201

  const { userId } = req.params
  const query = { _id: userId }
  const user = await User.findOne(query)
  
  user.posts.push(req.body)
  await user.save()
  
  const post = user.posts[user.posts.length - 1]
  res.status(status).json({ status, response: post })
})

router.put('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const { postId, userId } = req.params
  const query = { _id: userId }
  const user = await User.findOne(query)
  const post = user.posts.id(postId)
  
  const { content, emotion } = req.body
  post.content = content
  post.emotion = emotion
  await user.save()
  
  res.status(status).json({ status, response: post })
})

router.delete('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId }
  const user = await User.findOne(query)
  const post = user.posts.id(req.params.postId) 

  post.remove()
  await user.save()

  res.json({ status, response: post })

})

module.exports = router
