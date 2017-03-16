import Microbe from '../../models/microbes'
import Outbreak from '../../models/outbreaks'
import { sendSignupMail, sendNudge } from '../../middleware'
/**
 * @api {post} /microbes Create a new microbe
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateMicrobe
 * @apiGroup Microbes
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X POST -d '{ "microbe": { "name": "Microbe 1", "referral_url": "https://microbe.io/new_url" } }' localhost:5000/microbes
 *
 * @apiParam {Object} microbe          Microbe object (required)
 * @apiParam {String} microbe.name Name (required).
 * @apiParam {String} microbe.referral_url Refferal id used for emails (optional).
 *
 * @apiSuccess {Object}   microbe           Microbe object
 * @apiSuccess {ObjectId} microbe._id       Microbe id
 * @apiSuccess {String}   microbe.name  Microbe name
 * @apiSuccess {String}   microbe.microbe_id      Microbe id
 * @apiSuccess {String} microbe.referral_url Microbe referral url.
 * @apiSuccess {ObjectId} microbe.owner Microbe owner.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *      "microbe": {
 *          "__v": 0,
 *          "updatedAt": "2017-02-08T06:53:31.911Z",
 *          "createdAt": "2017-02-08T06:53:31.911Z",
 *          "name": "Microbe 1",
 *          "referral_url": "https://microbe.io/new_url",
 *          "_id": "589ac06b5138791a064b31ec",
 *          "microbe_id": "zr4peqq",
 *          "owner": "wqerk1oiuoiuqwernqweoruqwer"
 *      }
 *  }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 */

export async function createMicrobe (ctx) {
  try {
    if (!ctx.request.body.microbe.outbreak_id) {
      ctx.throw(422, 'You need an outbreak id')
    }

    const outbreak = await Outbreak.findOne({ outbreak_id: ctx.request.body.microbe.outbreak_id })

    if (!outbreak) {
      ctx.throw(422, 'The outbreak id you have supplied is invalid')
    }

    const _microbe = Object.assign({}, ctx.request.body.microbe)
    _microbe.outbreak_slug = _microbe.outbreak_id
    _microbe.outbreak_id = outbreak._id

    const microbe = new Microbe(_microbe)

    if (ctx.request.body.microbe.code) {
      const referrer = await Microbe.findOne({ referral_code: ctx.request.body.microbe.code })
      if (referrer) {
        referrer.microbials.push(microbe._id)
        await referrer.save()
        if (outbreak.number_of_nudges && referrer.microbials && referrer.microbials.length <= outbreak.number_of_nudges) {
          sendNudge(outbreak, referrer, microbe)
        }
      }
    }

    await microbe.save()
    const response = microbe.toJSON()
    sendSignupMail(outbreak, microbe)

    ctx.body = {
      microbe: response
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

/**
 * @api {get} /microbes Get all microbes
 * @apiPermission microbe
 * @apiVersion 1.0.0
 * @apiName GetMicrobes
 * @apiGroup Microbes
 *
 * @apiExample Example usage:
 * curl -X GET -H "Content-Type: application/json" -H "x-auth-token: {token}" "http://localhost:5000/microbes"
 *
 * @apiSuccess {Object[]} microbes           Array of microbe objects
 * @apiSuccess {ObjectId} microbes._id       Microbe id
 * @apiSuccess {String}   microbes.name      Microbe name
 * @apiSuccess {String}   microbes.email  Microbe email
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "microbes": [{
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Microbe 1",
 *           "__v": 0,
 *           "microbe_id": "sq0ne0x"
 *           },
 *           {
 *           "_id": "589abff26b0dc319ae919866",
 *           "updatedAt": "2017-02-08T06:51:30.198Z",
 *           "createdAt": "2017-02-08T06:51:30.198Z",
 *           "name": "Microbe 1",
 *           "__v": 0,
 *           "microbe_id": "sq0ne0x"
 *           },
 *           {
 *           "_id": "589ac0156b0dc319ae919867",
 *           "updatedAt": "2017-02-08T06:52:05.652Z",
 *           "createdAt": "2017-02-08T06:52:05.652Z",
 *           "name": "Microbe 1",
 *           "referral_url": "https://microbe.io/new_url",
 *           "__v": 0,
 *           "microbe_id": "sq0ne0x"
 *           }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getMicrobes (ctx) {
  const microbes = await Microbe.find({}).populate('microbials')
  ctx.body = { microbes }
}

/**
 * @api {get} /microbes/:id Get microbe by id
 * @apiPermission microbe
 * @apiVersion 1.0.0
 * @apiName GetMicrobe
 * @apiGroup Microbes
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X GET localhost:5000/microbes/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   microbes           Microbe object
 * @apiSuccess {ObjectId} microbes._id       Microbe id
 * @apiSuccess {String}   microbes.name      Microbe name
 * @apiSuccess {String}   microbes.email  Microbe email
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "microbe": {
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Microbe 1",
 *           "__v": 0,
 *           "microbe_id": "sq0ne0x"
 *       }
 *    }
 *
 * @apiUse TokenError
 */
export async function getMicrobe (ctx, next) {
  try {
    const microbe = await Microbe.findById(ctx.params.id)
    if (!microbe) {
      ctx.throw(404)
    }

    ctx.body = {
      microbe
    }
  } catch (err) {
    if (err.status === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) { return next() }
}

/**
 * @api {put} /microbes/:id Update a microbe
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateMicrobe
 * @apiGroup Microbes
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X PUT -d '{ "microbe": { "name": "Microbe 13" } }' localhost:5000/microbes/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} microbe          Microbe object (required)
 * @apiParam {String} microbe.name     Name.
 * @apiParam {String} microbe.referral_url Referral url.
 *
 * @apiSuccess {Object}   microbes           Microbe object
 * @apiSuccess {ObjectId} microbes._id       Microbe id
 * @apiSuccess {String}   microbes.name      Updated name
 * @apiSuccess {String}   microbes.referral_url  Updated referral url
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "microbe": {
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Microbe 13",
 *           "__v": 0,
 *           "microbe_id": "sq0ne0x"
 *          }
 *      }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */
export async function updateMicrobe (ctx) {
  const microbe = ctx.body.microbe

  Object.assign(microbe, ctx.request.body.microbe)

  await microbe.save()

  ctx.body = {
    microbe
  }
}

/**
 * @api {delete} /microbes/:id Delete a microbe
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteMicrobe
 * @apiGroup Microbes
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X DELETE localhost:5000/microbes/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

export async function deleteMicrobe (ctx) {
  const microbe = ctx.body.microbe

  await microbe.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
