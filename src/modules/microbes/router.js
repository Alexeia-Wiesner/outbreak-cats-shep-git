import { ensureUser } from '../../middleware/validators'
import * as microbe from './controller'

export const baseUrl = '/microbes'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      microbe.createMicrobe
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      microbe.getMicrobes
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      microbe.getMicrobe
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      microbe.getMicrobe,
      microbe.updateMicrobe
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureUser,
      microbe.getMicrobe,
      microbe.deleteMicrobe
    ]
  }
]
