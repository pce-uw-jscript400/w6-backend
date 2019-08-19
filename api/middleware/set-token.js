module.exports = (req, _res, next) => {
  try {
    req.token = req.headers.authorization.split('Bearer ')[1]
    next()
  } catch (_e) {
    req.token = null
    next()
  }
}

//Middlewear token, pulls from the header
//We define the token and attach a key
//Attaches the token to other routes