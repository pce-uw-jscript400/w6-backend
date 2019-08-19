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

router.delete('/:userId/posts/:postId', isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200

  const query = { _id: req.params.userId }
  const user = await User.findOne(query)
  const post = user.posts.id(req.params.postId)

  post.remove()
  await user.save()

  res.json({ status, response: post })
})

//Let's get our "Create a New Post" form to work. On the backend, create a CREATE Post route with the path of:
//POST /users/:userId/posts
//This request should only be able to be made if the user is logged in and it's from the same user as the
//one specified in the route.
router.post('/:userId/posts', isLoggedIn, isSameUser, validate, async (req, res, next) => {
  const status = 200
  const query = { _id: req.params.userId }
  const emotion = req.body.emotion
  const postContent = req.body.content
  const user =  await User.findOne(query)
  const updateObj = { emotion: emotion, content: postContent}
  user.posts.push(updateObj);
  user.save();
  res.json({ status })
})

//Show the user's username on the navigation when they are logged in as a link. When clicked,
//go to a new page: `/users/<userId>/edit`
router.put('/:userId/edit', isLoggedIn, isSameUser, async (req, res, next) => {
  try{
    const status = 200
    const userId= { _id: req.params.userId }
    const options = { new: true }
    const response =  await User.findOneAndUpdate(userId, req.body, options).select('name')
    res.json({ status, response })
  }catch (err){
    console.log(`My Error: ${err}`)
    const error = new Error(err.message)
    error.status = 400
    next(error)
  }

})


module.exports = router
