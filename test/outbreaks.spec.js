import app from '../bin/server'
import supertest from 'supertest'
import { should } from 'chai'
import { cleanDb, authUser } from './utils'

should()
const request = supertest.agent(app.listen())
const context = {}

describe('Outbreaks', () => {
  before((done) => {
    cleanDb()
    authUser(request, (err, { user, token }) => {
      if (err) { return done(err) }

      context.user = user
      context.token = token
      done()
    })
  })

  describe('POST /outbreaks', () => {
    it('should reject oubreak when data is incomplete', (done) => {
      const { token } = context
      request
        .post('/outbreaks')
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .send({ username: 'supercoolname' })
        .expect(422, done)
    })

    it('should create an outbreak with owner and outbreak_id', (done) => {
      const { token } = context
      request
        .post('/outbreaks')
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .send({
          outbreak: {
            name: 'Test outbreak'
          }
        })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.outbreak.should.have.property('owner')
          res.body.outbreak.owner.should.equal(context.user._id)
          res.body.outbreak.should.have.property('outbreak_id')

          context.outbreak = res.body.outbreak

          done()
        })
    })
  })

  describe('GET /outbreaks', () => {
    it('should not fetch outbreaks if the authorization header is missing', (done) => {
      request
        .get('/outbreaks')
        .set('Accept', 'application/json')
        .expect(401, done)
    })

    it('should not fetch outbreaks if the authorization header is missing the scheme', (done) => {
      request
        .get('/outbreaks')
        .set({
          Accept: 'application/json',
          Authorization: '1'
        })
        .expect(401, done)
    })

    it('should not fetch outbreaks if the authorization header has invalid scheme', (done) => {
      const { token } = context
      request
        .get('/outbreaks')
        .set({
          Accept: 'application/json',
          Authorization: `Unknown ${token}`
        })
        .expect(401, done)
    })

    it('should not fetch outbreaks if token is invalid', (done) => {
      request
        .get('/outbreaks')
        .set({
          Accept: 'application/json',
          Authorization: 'Bearer 1'
        })
        .expect(401, done)
    })

    it('should fetch all outbreaks', (done) => {
      authUser(request, (err, {}) => {
        if (err) { return done(err) }

        const { token } = context

        request
          .get('/outbreaks')
          .set({
            Accept: 'application/json',
            'x-auth-token': token
          })
          .expect(200, (err, res) => {
            if (err) { return done(err) }

            res.body.should.have.property('outbreaks')
            res.body.outbreaks.should.have.length(1)

            done()
          })
      })
    })
  })

  describe('GET /outbreaks/:id', () => {
    it('should not fetch outbreak if token is invalid', (done) => {
      const { outbreak } = context
      request
        .get(`/outbreaks/${outbreak._id}`)
        .set({
          Accept: 'application/json',
          'x-auth-token': 'token'
        })
        .expect(401, done)
    })

    it('should throw 404 if outbreak doesn\'t exist', (done) => {
      const { token } = context
      request
        .get('/outbreaks/1')
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .expect(404, done)
    })

    it('should fetch outbreak', (done) => {
      const {
        outbreak: { _id },
        token
      } = context

      request
        .get(`/outbreaks/${_id}`)
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.should.have.property('outbreak')

          done()
        })
    })
  })

  describe('PUT /outbreaks/:id', () => {
    it('should not update outbreak if token is invalid', (done) => {
      request
        .put('/outbreaks/1')
        .set({
          Accept: 'application/json',
          'x-auth-token': 'token'
        })
        .expect(401, done)
    })

    it('should throw 404 if outbreak doesn\'t exist', (done) => {
      const { token } = context
      request
        .put('/outbreaks/1')
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .expect(404, done)
    })

    it('should update outbreak', (done) => {
      const {
        outbreak: { _id },
        token
      } = context

      request
        .put(`/outbreaks/${_id}`)
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
      .send({ outbreak: { name: 'Cool Outbreak' } })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.outbreak.should.have.property('name')
          res.body.outbreak.name.should.equal('Cool Outbreak')
          res.body.outbreak.should.have.property('outbreak_id')
          res.body.outbreak.outbreak_id.should.equal(context.outbreak.outbreak_id)

          done()
        })
    })
  })

  describe('DELETE /outbreaks/:id', () => {
    it('should not delete user if token is invalid', (done) => {
      request
        .delete('/outbreaks/1')
        .set({
          Accept: 'application/json',
          'x-auth-token': 'token'
        })
        .expect(401, done)
    })

    it('should throw 404 if outbreak doesn\'t exist', (done) => {
      const { token } = context
      request
        .delete('/outbreaks/1')
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .expect(404, done)
    })

    it('should delete outbreak', (done) => {
      const {
        outbreak: { _id },
        token
      } = context

      request
        .delete(`/outbreaks/${_id}`)
        .set({
          Accept: 'application/json',
          'x-auth-token': token
        })
        .expect(200, done)
    })
  })
})
