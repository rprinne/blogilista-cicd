const logger = require('./logger')
const jwt = require('jsonwebtoken')

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('bearer')) {
    const token = authorization.replace('bearer ', '')
    const decodedToken = jwt.verify(token, process.env.SECRET)
    req.body.user = decodedToken.id
  }
  next()
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (error, req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler
}