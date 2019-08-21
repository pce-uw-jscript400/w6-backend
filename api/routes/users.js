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

// DELETE /users/:userId/posts/:postId

router.delete('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId }
  const user = await User.findOne(query)
  const post = user.posts.id(req.params.postId)
  post.remove()
  await user.save()

  res.json({ status, response: post })
})


router.delete('/:userId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId }
  const response = await User.findOneAndDelete(query, req.body).select(excludeKeys)

  res.json({ status, response })
})

// POST /users/:userId/posts

router.post('/:userId/posts/', isLoggedIn, async (req, res, next) => {
  const status = 201
  const query = { _id: req.params.userId }
  const response = "success"
  res.json({ status, response })

  // Post.create(req.body).then(response => {
  //   console.log(response)
  //   res.status(201).json({ status })
  // }).catch(error => {
  //   console.error(error)
  //   const err = new Error('Something went wrong')
  //   err.status = 400
  //   next(err)
  // })
})

module.exports = router
