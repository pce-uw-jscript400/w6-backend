const router = require('express').Router({ mergeParams: true })
const User = require('../models/user')
const { isLoggedIn, isSameUser } = require('../middleware/auth')

router.post('/', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 201

  const { userId } = req.params
  const query = { _id: userId }
  const user = await User.findOne(query)

  user.posts.push(req.body)
  await user.save()

  const post = user.posts[user.posts.length - 1]
  res.status(status).json({ status, response: post })
})

router.put('/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
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

router.delete('/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const { postId, userId } = req.params
  const query = { _id: userId }
  const user = await User.findOne(query)

  user.posts = user.posts.filter(post => post.id !== postId)
  await user.save()

  res.json({ status, response: user })
})

module.exports = router