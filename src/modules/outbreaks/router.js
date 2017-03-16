import { ensureUser } from '../../middleware/validators'
import * as outbreak from './controller'

export const baseUrl = '/outbreaks'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      outbreak.createOutbreak
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      outbreak.getOutbreaks
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      outbreak.getOutbreak
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      outbreak.getOutbreak,
      outbreak.updateOutbreak
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureUser,
      outbreak.getOutbreak,
      outbreak.deleteOutbreak
    ]
  }
]
