const models = require('../../database/models');
const { generateToken } = require('../auth/generateToken');
const crypto = require('crypto');
const { assert } = require('console');

const genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

const hashed = (data, salt) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(data);
  return hash.digest('hex');
};

/** @swagger
 *  parameters:
 *    adminAuth@header:
 *      name: x-token
 *      in: header
 *      description: access token provided to admin
 *      required: true
 *      type: string
 *      responses:
 *        200:
 *          description: Success
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */

/** @swagger
 *  /admins/login:
 *    post:
 *      summary: obtain access token for admin
 *      tags: [Admin]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: admin
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              accessToken:
 *                type: string
 *                format: uuid
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found (Failed to login)
 *        500:
 *          description: Internal Server Error
 */
exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const res = await models.Admin.findOne({ where: { email } });
  ctx.assert(res, 204);
  const value = hashed(password, res.salt);
  ctx.assert(value === res.password, 204);
  const token = await generateToken({ id: res.id });
  ctx.cookies.set(process.env.ACCESS_TOKEN, token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  });
  ctx.status = 200;
  ctx.body = {
    auth: 'admin',
  };
};

/** @swagger
 *  /admins/check:
 *    get:
 *      summary: return whether access_token is admin's access_token
 *      tags: [Admin]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: query
 *          name: access_token
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              access:
 *                type: boolean
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.check = async (ctx) => {
  if (!ctx.request.user) {
    ctx.status = 204;
    return;
  }
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({ where: { id } });
  if (!admin) {
    ctx.status = 204;
    return;
  }
  ctx.status = 200;
  ctx.body = { auth: 'admin' };
};

/** @swagger
 *  /admins/register:
 *    post:
 *      summary: add admin account
 *      tags: [Admin]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: admin
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                format: uuid
 *              email:
 *                type: string
 *                format: email
 *              salt:
 *                type: string
 *              password:
 *                type: string
 *              updated_at:
 *                type: string
 *                format: date-time
 *              created_at:
 *                type: string
 *                format: date-time
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.register = async (ctx) => {
  const { email, password, key } = ctx.request.body;
  ctx.assert(key === process.env.ADMIN_KEY, 404);
  const res = await models.Admin.findOne({ where: { email } });
  ctx.assert(!res, 400);
  var salt = genRandomString(16);
  const value = hashed(password, salt);
  ctx.response.body = await models.Admin.create({
    email,
    salt,
    password: value,
  });
};
