import User from '../models/users'
import config from '../../config'
import { verify } from 'jsonwebtoken'
import better from '../utils/better'

export async function ensureUser (ctx, next) {
  const token = ctx.headers['x-auth-token']
  if (!token) {
    ctx.throw(401, better.error({ message: 'Unathorized' }))
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    ctx.throw(401, better.error({ message: 'Unathorized' }))
  }
  const user = await User.findById(decoded.id, '-password')

  if (!user) {
    ctx.throw(401, better.error({ message: 'Unathorized' }))
  }
  ctx.state.user = user
  return next()
}

