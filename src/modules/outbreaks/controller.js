import Outbreak from '../../models/outbreaks'

/**
 * @api {post} /outbreaks Create a new outbreak
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateOutbreak
 * @apiGroup Outbreaks
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X POST -d '{ "outbreak": { "name": "Outbreak 1", "referral_url": "https://outbreak.io/new_url" } }' localhost:5000/outbreaks
 *
 * @apiParam {Object} outbreak          Outbreak object (required)
 * @apiParam {String} outbreak.name Name (required).
 * @apiParam {String} outbreak.referral_url Refferal id used for emails (optional).
 *
 * @apiSuccess {Object}   outbreak           Outbreak object
 * @apiSuccess {ObjectId} outbreak._id       Outbreak id
 * @apiSuccess {String}   outbreak.name  Outbreak name
 * @apiSuccess {String}   outbreak.outbreak_id      Outbreak id
 * @apiSuccess {String} outbreak.referral_url Outbreak referral url.
 * @apiSuccess {ObjectId} outbreak.owner Outbreak owner.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *      "outbreak": {
 *          "__v": 0,
 *          "updatedAt": "2017-02-08T06:53:31.911Z",
 *          "createdAt": "2017-02-08T06:53:31.911Z",
 *          "name": "Outbreak 1",
 *          "referral_url": "https://outbreak.io/new_url",
 *          "_id": "589ac06b5138791a064b31ec",
 *          "outbreak_id": "zr4peqq",
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
export async function createOutbreak (ctx) {
  const outbreak = new Outbreak(ctx.request.body.outbreak)
  try {
    outbreak.owner = ctx.state.user._id
    await outbreak.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const response = outbreak.toJSON()

  ctx.body = {
    outbreak: response
  }
}

/**
 * @api {get} /outbreaks Get all outbreaks
 * @apiPermission outbreak
 * @apiVersion 1.0.0
 * @apiName GetOutbreaks
 * @apiGroup Outbreaks
 *
 * @apiExample Example usage:
 * curl -X GET -H "Content-Type: application/json" -H "x-auth-token: {token}" "http://localhost:5000/outbreaks"
 *
 * @apiSuccess {Object[]} outbreaks           Array of outbreak objects
 * @apiSuccess {ObjectId} outbreaks._id       Outbreak id
 * @apiSuccess {String}   outbreaks.name      Outbreak name
 * @apiSuccess {String}   outbreaks.email  Outbreak email
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "outbreaks": [{
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Outbreak 1",
 *           "__v": 0,
 *           "outbreak_id": "sq0ne0x"
 *           },
 *           {
 *           "_id": "589abff26b0dc319ae919866",
 *           "updatedAt": "2017-02-08T06:51:30.198Z",
 *           "createdAt": "2017-02-08T06:51:30.198Z",
 *           "name": "Outbreak 1",
 *           "__v": 0,
 *           "outbreak_id": "sq0ne0x"
 *           },
 *           {
 *           "_id": "589ac0156b0dc319ae919867",
 *           "updatedAt": "2017-02-08T06:52:05.652Z",
 *           "createdAt": "2017-02-08T06:52:05.652Z",
 *           "name": "Outbreak 1",
 *           "referral_url": "https://outbreak.io/new_url",
 *           "__v": 0,
 *           "outbreak_id": "sq0ne0x"
 *           }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getOutbreaks (ctx) {
  const outbreaks = await Outbreak.find({}, '-password')
  ctx.body = { outbreaks }
}

/**
 * @api {get} /outbreaks/:id Get outbreak by id
 * @apiPermission outbreak
 * @apiVersion 1.0.0
 * @apiName GetOutbreak
 * @apiGroup Outbreaks
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X GET localhost:5000/outbreaks/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   outbreaks           Outbreak object
 * @apiSuccess {ObjectId} outbreaks._id       Outbreak id
 * @apiSuccess {String}   outbreaks.name      Outbreak name
 * @apiSuccess {String}   outbreaks.email  Outbreak email
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "outbreak": {
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Outbreak 1",
 *           "__v": 0,
 *           "outbreak_id": "sq0ne0x"
 *       }
 *    }
 *
 * @apiUse TokenError
 */
export async function getOutbreak (ctx, next) {
  try {
    const outbreak = await Outbreak.findById(ctx.params.id)
    if (!outbreak) {
      ctx.throw(404)
    }

    ctx.body = {
      outbreak
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
 * @api {put} /outbreaks/:id Update a outbreak
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateOutbreak
 * @apiGroup Outbreaks
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X PUT -d '{ "outbreak": { "name": "Outbreak 13" } }' localhost:5000/outbreaks/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} outbreak          Outbreak object (required)
 * @apiParam {String} outbreak.name     Name.
 * @apiParam {String} outbreak.referral_url Referral url.
 *
 * @apiSuccess {Object}   outbreaks           Outbreak object
 * @apiSuccess {ObjectId} outbreaks._id       Outbreak id
 * @apiSuccess {String}   outbreaks.name      Updated name
 * @apiSuccess {String}   outbreaks.referral_url  Updated referral url
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "outbreak": {
 *           "_id": "589abfe06b0dc319ae919865",
 *           "updatedAt": "2017-02-08T06:51:12.463Z",
 *           "createdAt": "2017-02-08T06:51:12.463Z",
 *           "name": "Outbreak 13",
 *           "__v": 0,
 *           "outbreak_id": "sq0ne0x"
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
export async function updateOutbreak (ctx) {
  const outbreak = ctx.body.outbreak

  Object.assign(outbreak, ctx.request.body.outbreak)

  await outbreak.save()

  ctx.body = {
    outbreak
  }
}

/**
 * @api {delete} /outbreaks/:id Delete a outbreak
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteOutbreak
 * @apiGroup Outbreaks
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -H "x-auth-token: {token}" -X DELETE localhost:5000/outbreaks/56bd1da600a526986cf65c80
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

export async function deleteOutbreak (ctx) {
  const outbreak = ctx.body.outbreak

  await outbreak.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
