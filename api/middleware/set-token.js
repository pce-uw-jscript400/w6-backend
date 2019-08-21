module.exports = (req, _res, next) => {
  try {
    // attaching arbitrary key to request
    // in subsequent routes we have access to token
    req.token = req.headers.authorization.split('Bearer ')[1]
    next()
  } catch (_e) {
    req.token = null
    next()
  }
}
